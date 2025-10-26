package io.github.SahanChamara.dto;

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
}
