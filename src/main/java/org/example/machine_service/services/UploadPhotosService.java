package org.example.machine_service.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

@Service
public class UploadPhotosService {
    AmazonS3 s3Client;

    private final Logger logger = LoggerFactory.getLogger(UploadPhotosService.class);

    private final String bucketName = "motorservicephotos";

    @Autowired
    public UploadPhotosService(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadImage(MultipartFile file, String fileName) throws IOException {
        // Сжатие изображения с использованием Thumbnailator
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Thumbnails.of(file.getInputStream())
                .size(800, 800) // Задайте размеры
                .outputQuality(0.8) // Уменьшение качества изображения (от 0.0 до 1.0)
                .toOutputStream(os);

        byte[] compressedImage = os.toByteArray();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(compressedImage);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(compressedImage.length);
        metadata.setContentType(file.getContentType());

        s3Client.putObject(bucketName, fileName, inputStream, metadata);

        // Возвращаем URL загруженного изображения
        return s3Client.getUrl(bucketName, fileName).toString();
    }

    public String getPhotoUrl(String fileName) {
        return s3Client.getUrl(bucketName, fileName).toString();
    }

    public byte[] getPhotoByte(String fileName) {
        S3Object s3Object = s3Client.getObject(new GetObjectRequest(bucketName, fileName));
        InputStream inputStream = s3Object.getObjectContent();
        try (inputStream) {
            byte[] result = inputStream.readAllBytes();
            logger.info("Обьект с именем {} сохранен", fileName);
            return result;
        } catch (IOException e) {
            logger.error("Ошибка при чтении содержимого файла из S3");
            throw new RuntimeException(e);
        }
    }

}
