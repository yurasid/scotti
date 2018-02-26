import React from 'react';
import renderer from 'react-test-renderer';
import Icon from './index';

test('Link changes the class when hovered', () => {
    const component = renderer.create(
        <Icon name='logorings' />
    );

    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
});