
import Page from '../../component/Page';

export default ()=>{
    return (
        <Page>
            <h1>Dashboard</h1>
            <a data-testid='scenario-link' href='/scenario/'>Scenario</a>
            <a data-testid='three-link' href='/three/'>Three.js Test</a>
        </Page>
    )
}