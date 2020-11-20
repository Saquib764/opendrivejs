import { render, screen, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer'
import Page from './index';

afterEach(cleanup)
test('<Page />: renders', () => {
  render(<Page />);
});

test('<Page />: renders correctly', ()=>{
  const {getByTestId} = render(<Page>My page</Page>)
  expect(getByTestId('page')).toHaveTextContent('My page')
})

test('<Page />: has class "motional-page"', ()=>{
  const {getByTestId} = render(<Page>My page</Page>)
  expect(getByTestId('page')).toHaveClass('motional-page')
})

test('<Page />: has class a custom class', ()=>{
  const {getByTestId} = render(<Page className='dashboard'>My page</Page>)
  expect(getByTestId('page')).toHaveClass('dashboard')
})

test('<Page />: has class a custom class and "motional-page"', ()=>{
  const {getByTestId} = render(<Page className='dashboard'>My page</Page>)
  expect(getByTestId('page')).toHaveClass('dashboard')
  expect(getByTestId('page')).toHaveClass('motional-page')
})

test('<Page />: test simple snapshot', ()=>{
  const tree = renderer.create(<Page className='dashboard'><div>Hi</div></Page>).toJSON()
  expect(tree).toMatchSnapshot()

})
