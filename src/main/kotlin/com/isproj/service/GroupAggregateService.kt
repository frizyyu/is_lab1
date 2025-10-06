package com.isproj.service

import com.isproj.api.CoordinatesDto
import com.isproj.api.GroupDto
import com.isproj.api.LocationDto
import com.isproj.api.PersonDto
import com.isproj.api.toDto
import com.isproj.domain.Coordinates
import com.isproj.domain.Group
import com.isproj.domain.Location
import com.isproj.domain.Person
import com.isproj.repo.CoordinatesRepository
import com.isproj.repo.GroupRepository
import com.isproj.repo.LocationRepository
import com.isproj.repo.PersonRepository
import jakarta.inject.Singleton

@Singleton
class GroupAggregateService(
    private val groups: GroupRepository,
    private val coords: CoordinatesRepository,
    private val persons: PersonRepository,
    private val locations: LocationRepository,
) {
    fun persist(dto: GroupDto): Group {
        val coord = upsertCoordinates(dto.coordinates)
        val loc = dto.groupAdmin.location?.let { upsertLocation(it) }
        val admin = upsertPerson(dto.groupAdmin.copy(location = loc?.toDto()))

        val entity =
            Group(
                id = dto.id,
                name = dto.name,
                coordinates = coord,
                studentsCount = dto.studentsCount,
                expelledStudents = dto.expelledStudents,
                transferredStudents = dto.transferredStudents,
                formOfEducation = dto.formOfEducation,
                shouldBeExpelled = dto.shouldBeExpelled,
                semesterEnum = dto.semesterEnum,
                groupAdmin = admin,
            )

        return if (dto.id == null) groups.save(entity) else groups.update(entity)
    }

    private fun upsertCoordinates(d: CoordinatesDto): Coordinates =
        if (d.id == null) {
            coords.save(Coordinates(id = null, x = d.x, y = d.y))
        } else {
            coords.update(Coordinates(id = d.id, x = d.x, y = d.y))
        }

    private fun upsertLocation(d: LocationDto): Location =
        if (d.id == null) {
            locations.save(Location(id = null, x = d.x, y = d.y, z = d.z))
        } else {
            locations.update(Location(id = d.id, x = d.x, y = d.y, z = d.z))
        }

    private fun upsertPerson(d: PersonDto): Person =
        if (d.id == null) {
            persons.save(
                Person(
                    id = null,
                    name = d.name,
                    eyeColor = d.eyeColor,
                    hairColor = d.hairColor,
                    height = d.height,
                    nationality = d.nationality,
                    location = d.location?.let { upsertLocation(it) },
                ),
            )
        } else {
            persons.update(
                Person(
                    id = d.id,
                    name = d.name,
                    eyeColor = d.eyeColor,
                    hairColor = d.hairColor,
                    height = d.height,
                    nationality = d.nationality,
                    location = d.location?.let { upsertLocation(it) },
                ),
            )
        }
}
