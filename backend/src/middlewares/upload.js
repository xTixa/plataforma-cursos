const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // RN03: vídeos até 500MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // RN03: PDFs até 20MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === 'video') {
      return {
        folder: 'plataforma-cursos/videos',
        resource_type: 'video',
        allowed_formats: ['mp4'],
      };
    }
    if (file.fieldname === 'pdf') {
      return {
        folder: 'plataforma-cursos/pdfs',
        resource_type: 'raw',
        allowed_formats: ['pdf'],
      };
    }
    return {
      folder: 'plataforma-cursos/thumbnails',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    };
  },
});

function fileFilter(req, file, cb) {
  if (file.fieldname === 'video' && file.mimetype !== 'video/mp4') {
    return cb(new ApiError(400, 'O vídeo deve estar em formato MP4'));
  }
  if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
    return cb(new ApiError(400, 'O ficheiro deve ser um PDF'));
  }
  if (
    file.fieldname === 'thumbnail' &&
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
  ) {
    return cb(new ApiError(400, 'A thumbnail deve ser uma imagem (jpg, png ou webp)'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE },
});

function enforceFieldSizeLimits(req, res, next) {
  if (!req.files) return next();

  const video = req.files.video?.[0];
  const pdf = req.files.pdf?.[0];
  const thumbnail = req.files.thumbnail?.[0];

  if (video && video.size > MAX_VIDEO_SIZE) {
    return next(new ApiError(400, 'O vídeo excede o limite de 500MB'));
  }
  if (pdf && pdf.size > MAX_PDF_SIZE) {
    return next(new ApiError(400, 'O PDF excede o limite de 20MB'));
  }
  if (thumbnail && thumbnail.size > MAX_IMAGE_SIZE) {
    return next(new ApiError(400, 'A thumbnail excede o limite de 5MB'));
  }
  next();
}

module.exports = { upload, enforceFieldSizeLimits };
