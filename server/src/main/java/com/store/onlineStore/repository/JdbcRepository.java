package com.store.onlineStore.repository;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcRepository {
	public final JdbcTemplate jdbcTemplate;

	@Autowired
	public JdbcRepository(DataSource dataSource) {
		jdbcTemplate = new JdbcTemplate(dataSource);
	}
}
