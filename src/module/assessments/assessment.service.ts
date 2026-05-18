import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { TransactionPort } from '../db/transaction/transaction.port';
import { AssessmentRepository } from './assessment.repository';
import { QuestionRepository } from '../questions/question.repository';
import { EnrollmentRepository } from '../enrollments/enrollment.repository';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { AssessmentSubmissionRepository } from '../assessmentSubmission/assessmentSubmission.repository';

@Injectable()
export class AssessmentService {
  constructor(
    private readonly transaction: TransactionPort,
    private readonly assessmentRepo: AssessmentRepository,
    private readonly questionRepo: QuestionRepository,
    private readonly enrollmentRepo: EnrollmentRepository,
    private readonly assessmentSubmissionRepo: AssessmentSubmissionRepository,
  ) {}

  /**
   * Creates a new assessment with its questions in a single transaction.
   * The assessment must belong to either a course or a module, not both.
   *
   * @param dto - The assessment creation payload
   * @returns A success message confirming the assessment was created
   * @throws {BadRequestException} If neither courseId nor moduleId is provided
   * @throws {BadRequestException} If both courseId and moduleId are provided
   */
  async create(dto: CreateAssessmentDto) {
    const { title, courseId, moduleId, passingScore, timeLimit, questions } =
      dto;

    if (!courseId && !moduleId) {
      throw new BadRequestException(
        'Assessment must belong to a course or module',
      );
    }
    if (courseId && moduleId) {
      throw new BadRequestException(
        'Assessment cannot belong to both a course and a module',
      );
    }

    return this.transaction.run(async (tx) => {
      const assessment = await this.assessmentRepo.create(
        {
          title,
          passingScore,
          timeLimit,
          course: courseId ? { connect: { id: courseId } } : undefined,
          module: moduleId ? { connect: { id: moduleId } } : undefined,
        },
        tx,
      );

      await this.questionRepo.createMany(assessment.id, questions, tx);

      return { message: 'Assessment created successfully' };
    });
  }

  /**
   * Retrieves an assessment for a student to take.
   *
   * @param assessmentId - The ID of the assessment to retrieve
   * @param studentId - The ID of the student requesting the assessment
   *
   * @returns The assessment data with questions (correctAnswer excluded)
   *
   * @throws {NotFoundException} If the assessment does not exist
   * @throws {NotFoundException} If the assessment is not linked to any course
   * @throws {ForbiddenException} If the student is not enrolled in the related course
   */
  async takeAssessment(assessmentId: string, studentId: string) {
    const assessment = await this.assessmentRepo.findOne(assessmentId);

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const courseId = assessment.courseId ?? assessment.module?.courseId;

    if (!courseId) {
      throw new NotFoundException('Assessment is not linked to any course');
    }

    const enrollment = await this.enrollmentRepo.findByUserAndCourse(
      studentId,
      courseId,
    );

    if (!enrollment) {
      throw new ForbiddenException(
        'You are not enrolled in the course for this assessment',
      );
    }

    return { data: assessment };
  }

  /**
   * Submits an assessment and calculates the student's score.
   *
   * @param assessmentId - The ID of the assessment being submitted
   * @param studentId - The ID of the student submitting the assessment
   * @param dto - The student's submitted answers
   *
   * @returns Submission result containing:
   * - `score`: percentage score (0-100)
   * - `passed`: whether the student passed based on passingScore
   * - `breakdown`: per-question result including correctAnswer for review
   *
   * @throws {NotFoundException} If the assessment does not exist
   * @throws {NotFoundException} If a submitted questionId does not belong to the assessment
   */
  async submitAssessment(
    assessmentId: string,
    studentId: string,
    dto: SubmitAssessmentDto,
  ) {
    const assessment =
      await this.assessmentRepo.findOneWithAnswers(assessmentId);

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // 3. Grade each answer
    const gradedAnswers = dto.answers.map((studentAnswer) => {
      const question = assessment.questions.find(
        (q) => q.id === studentAnswer.questionId,
      );

      if (!question) {
        throw new NotFoundException(
          `Question ${studentAnswer.questionId} not found`,
        );
      }

      return {
        questionId: question.id,
        answer: studentAnswer.answer,
        isCorrect: question.correctAnswer === studentAnswer.answer,
        correctAnswer: question.correctAnswer,
      };
    });

    const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
    const totalCount = assessment.questions.length;
    const score = Math.round((correctCount / totalCount) * 100);

    const passed = score >= assessment.passingScore;

    await this.assessmentSubmissionRepo.saveSubmission({
      userId: studentId,
      assessmentId,
      score,
      passed,
      answers: gradedAnswers,
    });

    return {
      data: {
        score,
        passed,
        breakdown: gradedAnswers,
      },
    };
  }
}
