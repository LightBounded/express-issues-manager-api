import express from 'express'
import { createConnection } from 'mysql'
import { Issue } from './interfaces/Issue'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const db = createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'issues_manager',
})

app.listen(3000, () => {
	console.log('Server listening on port 3000')
})

app.get('/issues', (req, res) => {
	const cmd = 'SELECT * FROM issues'
	db.query(cmd, (err, fields: Issue[]) => {
		if (err) throw err
		res.json(
			fields.map(
				field => (field = { ...field, isOpen: field.isOpen === 1 ? true : false })
			)
		)
	})
})

app.post('/issues', (req, res) => {
	const cmd = 'INSERT INTO issues SET ?'
	const issue: Issue = req.body

	db.query(cmd, issue, err => {
		if (err) throw err
		res.end()
	})
})

app.put('/issues/:id', (req, res) => {
	const issue: Issue = req.body
	const id = req.params.id
	const cmd = 'UPDATE issues SET ? WHERE id = ?'

	db.query(cmd, [issue, id], err => {
		if (err) throw err
		res.end()
	})
})

app.delete('/issues/:id', (req, res) => {
	const id = req.params.id
	const cmd = `DELETE FROM issues WHERE id = ?`
	db.query(cmd, id, err => {
		if (err) throw err
		res.end()
	})
})
