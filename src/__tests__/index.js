import React from 'react';
import { shallow, mount, render } from 'enzyme';

describe('', () => {
  it('newState', () => {
    const { createHOC } = require("../");

    // functional stateful component
    const Counter = createHOC(use => {
      // initial phase == constructor
      const { get, set } = use(({ newState }) => newState(0));
      const increment = () => set(get() + 1);

      // render function
      return () => (
        <div>
          <span >{get()}</span>
          <button onClick={increment}>Increment</button>
        </div>
      );
    });

    const wrapper = mount(<Counter />);

    expect(wrapper.find('span').text()).toBe("0")

    wrapper.find('button').simulate('click')
    expect(wrapper.find('span').text()).toBe("1")

  });
});
