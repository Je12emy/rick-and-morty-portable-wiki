import React from 'react';
import renderer from 'react-test-renderer';
import {ViewCharacter} from '../views/ViewCharacter';
import {QueryClient, QueryClientProvider} from 'react-query';

// const wrapper = ({children}) => {
//   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
// };



// test('renders view character correctly', () => {
//   const queryClient = new QueryClient();

//   const tree = renderer
//     .create(
//       <QueryClientProvider client={queryClient}>
//         <ViewCharacter
//           route={{
//             params: {
//               characterId: 1,
//             },
//           }}
//         />
//       </QueryClientProvider>,
//     )
//     .toJSON();
//   expect(tree).toMatchSnapshot();
// });
