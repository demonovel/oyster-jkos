import Link from 'next/link'
import Layout from '../components/Layout'
import PickExcel from '../components/PickExcel';

const IndexPage = () => (
	<Layout title="街口請款報表">
		<h1>街口請款報表 👋</h1>
		<p>
			<PickExcel />
		</p>
	</Layout>
)

export default IndexPage
