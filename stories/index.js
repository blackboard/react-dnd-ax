import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import  BasicExample  from '../src/examples/BasicExample'
storiesOf('Button', module)
  .add('with text', () => (
    <BasicExample />
  ))
