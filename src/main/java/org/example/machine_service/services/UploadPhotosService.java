package org.example.machine_service.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import net.coobird.thumbnailator.Thumbnails;
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
    @Autowired
    AmazonS3 s3Client;

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

        // Метаданные файла
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(compressedImage.length);
        metadata.setContentType(file.getContentType());

        // Загрузка в S3
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
            return inputStream.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при чтении содержимого файла из S3", e);
        }
    }

}
