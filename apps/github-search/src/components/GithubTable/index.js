import PropTypes from 'prop-types'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	Link,
} from '@mui/material'

const tableHeaders = [
	'Repository',
	'Stars',
	'Forks',
	'Open issues',
	'Updated at',
]

export const GithubTable = ({ repositoriesList }) => {
	return (
		<TableContainer sx={{ maxHeight: 440 }}>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						{tableHeaders.map((headerName) => (
							<TableCell key={headerName}>{headerName}</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{repositoriesList.map(
						({
							name,
							id,
							stargazers_count: stargazersCount,
							forks_count: forksCount,
							open_issues_count: openIssuesCount,
							updated_at: updatedAt,
							html_url: htmlUrl,
							owner: { avatar_url: avatarUrl },
						}) => (
							<TableRow key={id}>
								<TableCell>
									<Avatar alt={name} src={avatarUrl} />
									<Link href={htmlUrl}>{name}</Link>
								</TableCell>
								<TableCell>{stargazersCount}</TableCell>
								<TableCell>{forksCount}</TableCell>
								<TableCell>{openIssuesCount}</TableCell>
								<TableCell>{updatedAt}</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default GithubTable

GithubTable.propTypes = {
	repositoriesList: PropTypes.arrayOf(PropTypes.object).isRequired,
}
