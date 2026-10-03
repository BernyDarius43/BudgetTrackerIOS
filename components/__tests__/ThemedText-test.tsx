import * as React from 'react';
import renderer, { act } from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#11181C',
}));

it(`renders correctly`, async () => {
  let component: any = null;

  await act(async () => {
    component = renderer.create(<ThemedText>Snapshot test!</ThemedText>);
  });

  const tree = component?.toJSON();

  expect(tree).toMatchSnapshot();
});
