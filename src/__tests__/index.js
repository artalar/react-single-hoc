import React from 'react';
import { shallow, mount, render } from 'enzyme';

// TODO: add test for internal API (lifecycle hooks)
describe('react-single-hoc', () => {
  it('state', () => {
    const { createHOC, createState } = require('../');

    // functional stateful component
    const Counter = createHOC(use => {
      // initial phase == constructor
      const { get, set } = use(createState(0));
      const increment = () => set(get() + 1);

      // render function
      return () => (
        <div>
          <span>{get()}</span>
          <button onClick={increment}>Increment</button>
        </div>
      );
    });

    const wrapper = mount(<Counter />);

    expect(wrapper.find('span').text()).toBe('0');

    wrapper.find('button').simulate('click');
    expect(wrapper.find('span').text()).toBe('1');
  });

  it('effect', () => {
    const { createHOC, createState, createEffect } = require('../');
    const cb = jest.fn();

    const Counter = createHOC(use => {
      const { get, set } = use(createState(0));
      const increment = () => set(get() + 1);
      use(createEffect(cb));

      return () => (
        <div>
          <span>{get()}</span>
          <button onClick={increment}>Increment</button>
        </div>
      );
    });

    const wrapper = mount(<Counter />);

    expect(cb.mock.calls.length).toBe(0);

    wrapper.find('button').simulate('click');
    expect(cb.mock.calls.length).toBe(1);
    wrapper.find('button').simulate('click');
    expect(cb.mock.calls.length).toBe(2);

    wrapper.unmount();
    expect(cb.mock.calls.length).toBe(2);
  });

  it('subscribe', () => {
    const { createHOC, createState, createSubscriber } = require('../');
    const track = jest.fn();
    let cb = () => {};

    const Counter = createHOC(use => {
      const { get, set } = use(createState(0));
      const increment = () => set(get() + 1);

      use(
        createSubscriber(() => {
          cb = () => {
            track();
            increment();
          };
          return () => {
            cb = () => {};
          };
        }),
      );

      return () => (
        <div>
          <span>{get()}</span>
          <button onClick={increment}>Increment</button>
        </div>
      );
    });

    cb();
    expect(track.mock.calls.length).toBe(0);

    const wrapper = mount(<Counter />);

    expect(track.mock.calls.length).toBe(0);
    expect(wrapper.find('span').text()).toBe('0');

    cb();
    expect(track.mock.calls.length).toBe(1);
    expect(wrapper.find('span').text()).toBe('1');

    wrapper.unmount();
    cb();
    expect(track.mock.calls.length).toBe(1);
  });

  it('do not use hooks outside initial phase', () => {
    const { createHOC, createState } = require('../');

    const Counter = createHOC(use => {
      return () => {
        use(createState(0));
        return (
          <div>
            <span>{get()}</span>
            <button onClick={increment}>Increment</button>
          </div>
        );
      };
    });

    expect(() => mount(<Counter />)).toThrow(
      'You can not use hooks outside initial phase',
    );
  });
});
