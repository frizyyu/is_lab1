package com.isproj.api

import com.isproj.domain.enums.Color
import com.isproj.domain.enums.Country
import com.isproj.domain.enums.FormOfEducation
import com.isproj.domain.enums.Semester
import io.micronaut.serde.annotation.Serdeable
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive
import java.time.LocalDateTime

@Serdeable
data class CoordinatesDto(
    val id: Long? = null,
    val x: Double,
    val y: Long,
)

@Serdeable
data class LocationDto(
    val id: Long? = null,
    val x: Float? = null,
    val y: Double,
    val z: Long? = null,
    val name: String? = null,
)

@Serdeable
data class PersonDto(
    val id: Long? = null,
    @field:NotBlank
    val name: String,
    @field:NotNull
    val eyeColor: Color,
    @field:NotNull
    val hairColor: Color,
    @field:NotNull @field:Positive
    val height: Double,
    val nationality: Country? = null,
    val location: LocationDto? = null,
)

@Serdeable
data class GroupDto(
    val id: Long? = null,
    @field:NotBlank
    val name: String,
    @field:NotNull
    val coordinates: CoordinatesDto,
    val creationDate: LocalDateTime? = null,
    @field:Positive
    val studentsCount: Long,
    @field:Min(0)
    val expelledStudents: Long,
    @field:Min(0)
    val transferredStudents: Int,
    @field:NotNull
    val formOfEducation: FormOfEducation,
    @field:Positive
    val shouldBeExpelled: Long,
    @field:NotNull
    val semesterEnum: Semester,
    @field:NotNull
    val groupAdmin: PersonDto,
)
