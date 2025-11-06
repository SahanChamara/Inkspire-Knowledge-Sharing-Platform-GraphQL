package io.github.SahanChamara.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Writer {
    private Long id;
    private String name;
    private String bio;

    @Email
    private String email;

    @NotBlank(message = "password cannot be empty")
    @Size(min = 8, max = 15, message = "password must be between 8 and 20 characters ")
    private String password;
}
