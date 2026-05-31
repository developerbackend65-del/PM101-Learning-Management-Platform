import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    private courseRepo: CourseRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Retrieves a paginated list of courses with an optional search filter.
   *
   * @param page - The page number to retrieve (1-indexed). Defaults to `1`.
   * @param limit - The maximum number of courses per page. Defaults to `10`.
   * @param search - Optional search string to filter courses by name or other fields.
   * @returns A paginated result containing the matching courses.
   */
  public getAllCourses(page: number = 1, limit: number = 10, search?: string) {
    return this.courseRepo.findAll(page, limit, search);
  }

  /**
   * Retrieves a single course by its unique identifier.
   *
   * @param id - The unique identifier of the course to retrieve.
   * @returns The course data matching the provided ID.
   * @throws {NotFoundException} If no course exists with the given ID.
   */
  public async getCourseById(id: string) {
    const course = await this.courseRepo.findById(id);

    if (!course) {
      throw new NotFoundException('no course found with this id');
    }
    return { data: course };
  }

  /**
   * Creates a new course with an uploaded thumbnail image.
   *
   * @param dto - The data required to create a course.
   * @param adminId - The ID of the admin creating the course.
   * @param file - The thumbnail image file to upload to Cloudinary.
   * @returns The created course with a success message.
   * @throws {InternalServerErrorException} If the image upload to Cloudinary fails.
   */
  public async createCourse(dto: CreateCourseDto, adminId: string, file: any) {
    let upload: { url: string; thumbnailPublicId: string };

    try {
      upload = await this.cloudinaryService.uploadImage(file);
    } catch {
      throw new InternalServerErrorException('Image upload failed');
    }

    const course = await this.courseRepo.create({
      ...dto,
      admin: { connect: { id: adminId } },
      thumbnailUrl: upload.url,
      thumbnailPublicId: upload.thumbnailPublicId,
    });

    return {
      message: 'Course created successfully',
      data: course,
    };
  }

  /**
   * Updates an existing course by ID, optionally replacing the thumbnail image.
   *
   * @param dto - The data to update the course with.
   * @param adminId - The ID of the admin performing the update.
   * @param courseId - The unique identifier of the course to update.
   * @param file - Optional new thumbnail image file. If provided, the old thumbnail
   *               is deleted from Cloudinary and replaced with the new one.
   * @returns The updated course with a success message.
   * @throws {NotFoundException} If no course is found matching the given courseId and adminId.
   */
  public async updateCourse(
    dto: UpdateCourseDto,
    adminId: string,
    courseId: string,
    file?: any,
  ) {
    const course = await this.courseRepo.findByIdAndAdminId(courseId, adminId);

    if (!course) {
      throw new NotFoundException('');
    }

    let thumbnailUrl = course.thumbnailUrl;
    let thumbnailPublicId = course.thumbnailPublicId;

    if (file) {
      if (course.thumbnailPublicId) {
        await this.cloudinaryService.deleteImage(course.thumbnailPublicId);
      }
      const uploaded = await this.cloudinaryService.uploadImage(file);
      thumbnailUrl = uploaded.url;
      thumbnailPublicId = uploaded.thumbnailPublicId;
    }

    const Ncourse = await this.courseRepo.update(courseId, {
      ...dto,
      thumbnailUrl,
      thumbnailPublicId,
    });

    return {
      message: 'Course updated successfully',
      data: Ncourse,
    };
  }
}
