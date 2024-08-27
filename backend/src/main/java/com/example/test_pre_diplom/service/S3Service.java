package com.example.test_pre_diplom.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;

@Service
public class S3Service {
    //TODO
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
//    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKeyId = "AKIA3FLDXJQPXZYX72RZ";
//    @Value("${cloud.aws.credentials.secretKey}")
    private String secretAccessKey = "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";

    private final AmazonS3 s3Client;

    public S3Service() {
        AWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.EU_NORTH_1)
                .build();
    }

    public String uploadFile(MultipartFile multipartFile, String keyName) throws IOException {
        try {
            InputStream inputStream = multipartFile.getInputStream();
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            s3Client.putObject(new PutObjectRequest(bucketName, keyName, inputStream, metadata));
            return "https://" + bucketName + ".s3.amazonaws.com/" + keyName;
        } catch (AmazonServiceException e) {
            System.out.println(e.getMessage());
            return "";
        }

    }


    public byte[] getFileFromS3(String fileUrl) {
        // Подключение к Amazon S3
//        AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();

        // Разбор ссылки на объект S3
        URI uri;
        try {
            uri = new URI(fileUrl);
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Invalid S3 file URL: " + fileUrl, e);
        }

        String key = uri.getPath().substring(1); // Удаление первого символа '/', который есть в начале пути

        // Получение содержимого файла из S3
        S3Object object = s3Client.getObject(new GetObjectRequest(bucketName, key));
        try (S3ObjectInputStream objectInputStream = object.getObjectContent()) {
            return IOUtils.toByteArray(objectInputStream);
        } catch (IOException e) {
            throw new RuntimeException("Error reading file content from S3", e);
        }
    }

    public void deleteFileByUrl(String url) {
        try {
            // Извлекаем ключ объекта из URL
            String keyName = extractKeyNameFromUrl(url);
            if (keyName != null) {
                s3Client.deleteObject(new DeleteObjectRequest(bucketName, keyName));
                System.out.println("Файл успешно удален: " + keyName);
            } else {
                System.err.println("Ошибка при извлечении ключа объекта из URL: " + url);
            }
        } catch (Exception e) {
            System.err.println("Ошибка при удалении файла по URL " + url + ": " + e.getMessage());
        }
    }

    private String extractKeyNameFromUrl(String url) {
        try {
            URI s3Url = new URI(url);
            String path = s3Url.getPath();
            return path.substring(1);
        } catch (Exception e) {
            System.err.println("Ошибка при извлечении ключа объекта из URL: " + url);
            return null;
        }
    }
}
