const React = (function() {
  let hooks = [];
  let idx = 0;
  function useState(initVal) {
    const state = hooks[idx] || initVal;
    const _idx = idx;
    const setState = newVal => {
      hooks[_idx] = newVal;
    };
    idx++;
    return [state, setState];
  }

  function render(Component) {
    idx = 0;
    const C = Component();
    C.render();
    return C;
  }
  function useEffect(cb, depArray) {
    const oldDeps = hooks[idx];
    let hasChanged = true;
    if (oldDeps) {
      hasChanged = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }
    // detect change
    if (hasChanged) cb();
    hooks[idx] = depArray;
    idx++;
  }

  return { useState, render, useEffect };
})();

function Component() {
  // we have 2 hooks now
  const [count, setCount] = React.useState(1);
  const [text, setText] = React.useState('apple');
  React.useEffect(() => {
    console.log('use effect hook FTW!!!');
  }, [count]); // if I leave the empty array, it only runs once at the start
  // if I put in [count] it updates from 1 to 2
  // if I put in ['pear'] it updates when the text updates from 'apple' to 'pear'
  // and if I delete the array, it runs every single time.
  return {
    // just for simulating since we don't have a button or working with the DOM
    render: () => console.log({ count, text }),
    click: () => setCount(count + 1),
    type: word => setText(word),
  };
}

var App = React.render(Component);
App.click();
var App = React.render(Component);
App.type('pear');
var App = React.render(Component);
