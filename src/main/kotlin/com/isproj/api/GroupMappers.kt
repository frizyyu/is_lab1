package com.isproj.api

import com.isproj.domain.Group
import com.isproj.domain.Location
import com.isproj.domain.Person

fun Group.toDto() =
    GroupDto(
        id = id,
        name = name,
        coordinates = CoordinatesDto(
            id = coordinates.id,
            x = coordinates.x,
            y = coordinates.y,
        ),
        creationDate = creationDate,
        studentsCount = studentsCount,
        expelledStudents = expelledStudents,
        transferredStudents = transferredStudents,
        formOfEducation = formOfEducation,
        shouldBeExpelled = shouldBeExpelled,
        semesterEnum = semesterEnum,
        groupAdmin = groupAdmin.toDto(),
    )

fun Person.toDto() =
    PersonDto(
        id = id,
        name = name,
        eyeColor = eyeColor,
        hairColor = hairColor,
        height = height,
        nationality = nationality,
        location = location?.toDto(),
    )

fun Location.toDto() =
    LocationDto(
        id = id,
        x = x,
        y = y,
        z = z,
    )
