const unloadedDatabaseResponse = {
	success: false,
	reason: "Database is not loaded yet, try again soon"
}

const invalidFormatResponse = (err) => {
	return {
		success: false,
		reason: "Database error",
		error: err
	}
}

const databaseError = (err) => {
	return {
		success: false,
		reason: "Database error",
		error: err
	}
}

const successResponse = (payload) => {
	return {
		success: true,
		data:payload
	}
}

module.exports = {
  unloadedDatabaseResponse,
  invalidFormatResponse,
  databaseError,
  successResponse
}
