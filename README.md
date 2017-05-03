# react_hands-on_project

> A project made by vue-cli

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# React事始め
## 最初のコンポーネントを追加する
### まずは表示だけしてみる
vue-cliで作成したプロジェクトをreact化した続きから進めていきたいと思います。まず最初のコンポーネントを追加してみたいと思います。
'src/components/first-component.js'を追加して以下の内容にしてください。
```
import React, { Component } from 'react';

export default class FirstComponent extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <h1>Hello, React!</h1>
      </div>
    );
  }
}
```
特に値を受け取って表示するわけでもない上記コンポーネントをまずは表示できるようにしてみたいと思います。'main.js'を以下の内容にして'npm run dev'で動作が確認できます。
```
import React from 'react'
import { render } from 'react-dom'

import FirstComponent from './components/first-component'

render(
  <FirstComponent />
  , document.getElementById('app')
);
```

###　stateの値を表示してみる
今度はstateの値を表示できるようにしてみたいと思います。Reactではstateに似た概念としてpropsがありますがこれは親から受け取るプロパティはpropsにセットされ自分自身のコンポーネントで使う値はstateにセットするというもので、コンポーネント初期化時に呼び出されるconstructor(props)の中身を見たらどんな動きをしているのかわかると思います。

```
import React, { Component } from 'react';

export default class FirstComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copyText: '',
    };
  }

  textFromInput(e) {
     this.setState({ copyText: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  hintText="to text" value = { this.state.copyText } readOnly="readonly" /><br />
      </div>
    );
  }
}
```
### propsで引き継いだ値を子コンポーネントで利用する
まずpropTypesの宣言周りで必要になるのでbabelにpresetプラグインを有効化します。現在0から1,2,3と機能が異なるpresetが用意されていて具体的にどれを使えばよくわかっていないのですが、vue-cliでプロジェクトを作成した時に入っていたpreset-2を指定しておきたいと思います。.babelrcを以下のように修正します。
```
{
  "presets": [ "es2015", "react", "stage-2"]
}
```
それから、親からの値を受け取る側のコンポーネントを準備します。以下の"src/components/child-component.js"を作成します。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ChildComponent extends Component {
  static propTypes = {
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'init val'
  }
  constructor(props) {
    super(props);
  }

  render() {
    const { copyText } = this.props;
    return (
      <div>
        <label>{ copyText }</label>
      </div>
    );
  }
}
```
次に値を受け渡す側"src/components/first-componet.js"を以下のように修正します。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChildComponent from './child-component';

export default class FirstComponent extends Component {
  static propTypes = {
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'copy text'
  }
  constructor(props) {
    super(props);
    this.state = {
      copyText: 'copy text',
    };
  }

  textFromInput(e) {
     this.setState({ copyText: e.target.value });
  }

  render() {
    const { copyText } = this.state;


    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  placeholder="to text" value = { this.state.copyText } readOnly="readonly" /><br />
        <ChildComponent copyText={ copyText }/>
      </div>
    );
  }
}
```
renderの呼び出しで新しく作成したChildComponentコンポーネントのプロパティ'copyText'にテキスト入力した値が入るようになっています。ChildComponenは受け取ったプロパティをラベルでそのまま出すようにしておりまして動かしてみるとそれが確認できるかと思います。

ちなみに今回新しく追加したChildComponentは親コンポーネントのrenderメソッドで直接タグを記入していましたが、以下のようなコンポーネントを返すメソッドを用意しておいてrender内で呼び出すようにすることでも同様の動きになります。
```
renderItem(copyText){
  return (
    <ChildComponent copyText={ copyText }/>
  )
}
```
```
呼び出しサンプル
render() {
  const { copyText } = this.state;
  return (
    <div>
      <h1>Hello, React!</h1>
      <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
      <input name="a" type="text"  placeholder="to text" value = { this.state.copyText } readOnly="readonly" /><br />
      {this.renderItem(copyText)}
    </div>
  );
}
```
表示する内容を条件によって切り替える必要があるけどコンポーネントを分けるまでもない場合で、renderメソッド内をごちゃごちゃさせたくないという場合があるのでしたらこの方が良い場合もあるかもしれませんが、ルールを決めておかないと逆にわかりづらくなりそうなので注意が必要です。この辺りが柔軟そうなのは助かりそうではあります。
