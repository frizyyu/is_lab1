package com.isproj.repo

import com.isproj.domain.Coordinates
import io.micronaut.data.annotation.Repository
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository

@JdbcRepository(dialect = Dialect.POSTGRES)
@Repository
interface CoordinatesRepository : CrudRepository<Coordinates, Long>
