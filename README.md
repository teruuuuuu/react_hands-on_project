# react_hands-on_project
Reactの復習もかねてハンズオン用のプロジェクトを作成してみました。プロジェクトはvue-cliで作成しているのでwebpackのconfig周りでは使用していないvue周りの設定が残っていると思います。

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

## react-eduxを利用する
### Reduxでコンポーネンの値を変更してみる
先ほどは親コンポーネントのプロパティを直接子コンポーネントに渡して連携していました。今度はReduxのフレームワークを使用してコンポーネント間の連携を行っていきたいと思いまして、reactであれば[react-redux](https://github.com/reactjs/react-redux)というモジュールが公式から出ているのでこちらを利用したいと思います。    
まずReduxについての簡単な概要ですが、single-page-applicationの誕生により以前よりも多くの状態を管理する必要が出てきていましてFluxというフレームワーク
ではデータの流れを一方通行にしてしまうことで、例えばコンポーネント間でのデータのやりとりでそれぞれのコンポーネントが実データを更新する処理を行っているのであれば管理しづらくなるので
それを打開するため状態を更新する場合は共通のアクションを呼び出すなどしてデータを一方通行にするといった方法が出てきています。ReduxというのはFluexの実装の一つという位置づけのようなもので
厳密なFluxよりかはReactから扱いやすいように変更が加えられたものとなっています。

必要なモジュールがインストールし忘れていたのでインストール
> npm install --save react-redux
> npm install --save redux-thunk
> npm install babel-plugin-transform-decorators-legacy --save-dev

react-redux, redux-thunkについてはreact-redux関連のモジュールと想像がつくと思います。babel-plugin-transform-decorators-legacyについてはreduxが生成するstateをコンポーネントに関連付けるのに使用する@connetアノテーションで必要になります。    
まず.babelrcを修正してbabel-plugin-transform-decorators-legacyを有効にするようにしたいと思います。
```
{
  "presets": [ "es2015", "react", "stage-2"],
  "plugins": ["transform-decorators-legacy"]
}
```
次に"src/define/action/sample-action-define.js"に今回追加するアクションの定数定義を追加します。
```
export const CHANGE_TEXT = 'CHANGE_TEXT'
```

"src/reducers/sample-reducer.js"にstate更新に使用するreducerを追加します。これはコンポーネント側がアクションを呼び出して来た場合にここでstateの更新を行います。
```
import { CHANGE_TEXT } from '../define/action/sample-action-define'

const initialState = {
    text : 'init text'
  };

export default function sampleReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_TEXT:
      return Object.assign({}, state, { text: action.text})

    default:
      return state
  }
}
```

それから"src/reducers/index.js"にreducerをマージするためのメソッドを追加します。今回使用するReducerは一つだけなのであまり恩恵を感じないですが、複数のReducerが必要になる場合はこういったようにマージするメソッドがあった方が良さそうです。
```
import { combineReducers } from 'redux'
import sampleReducer from './sample-reducer'

const rootReducer = combineReducers({
  sampleReducer
})
export default rootReducer
```

Reducerを呼び出すアクションを"src/actions/sample-action.js"に追加します。アクション自体はコンポーネントがディスパッチという関数を使うことで呼び出すことができます。
```
import * as types from '../define/action/sample-action-define'

export function change_text(text) {
  return { type: types.CHANGE_TEXT, text: text }
}
```

stateを管理する大元であるstoreを"src/store/store-config.js"に作成します。applyMiddleware後にfinalCreateStoreやっているところでstoreを生成しています。applyMiddlewareについてはreactにおけるミドルウェアの機能を使う時に必要になるもので例えばログ出力や他サーバにリクエストを投げる場合などに利用されます。今回はミドルウェアを使用することもないのでapplyMiddlewareを使わずにcreateStoreだけでも良いはずですが、後からミドルウェアを使うことを想定し先にこの書き方にしておきます。module.hotの判定式の内部ではreduxを使う場合にホットリロードを行うための設定となっておりまして、これがない場合は開発車モードで起動中にファイルを保存するたびにstateが初期化されるのを防ぐためにあった方が良さそうなものです。
```
import { createStore, applyMiddleware  } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

export default function StoreConfig(preloadedState) {
  const finalCreateStore = applyMiddleware(thunk)(createStore);
  const store = finalCreateStore(rootReducer, preloadedState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }
  return store
}
```

Reactにreduxのstateを私て扱えるようにする。"src/main.js"が以下になるようにします。ここではreact-reduxモジュールのProviderコンポーネントにstoreを渡しています。
```
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import FirstComponent from './components/first-component'
import StoreConfig from './store/store-config'

const store = StoreConfig()
render(
  <Provider store={store}>
    <FirstComponent />
  </Provider >
  , document.getElementById('app')
);
```

それではReduxのstateを利用する側である"src/components/first-component.js"を以下のように修正します。mapStateToPropsにはstateの値が、mapDispatchToPropsにはディスパッチするために必要となるメソッドが格納されています。@connect(mapStateToProps, mapDispatchToProps)のアノテーションでreduxのstoreを渡しています。propTypesのプロパティと、textに変更があった時に呼び出すメソッドの情報が入っていてRenderメソッドではこれを使用して描画を行っています。またテキスト入力を行った際に呼び出されるtextFromInput内で"this.props.change_text(e.target.value)"でアクションを呼び出した上でディスパッチしてReducerにより新しいstateが発行されます。
```
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChildComponent from './child-component';

import * as SampleAction from '../actions/sample-action';

function mapStateToProps(state) {
  const { text } = state.sampleReducer
  return {
    text: text
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FirstComponent extends Component {
  static propTypes = {
    change_text: PropTypes.func.isRequired,
    text: PropTypes.string
  }
  constructor(props) {
    super(props);
  }

  textFromInput(e) {
    this.props.change_text(e.target.value)
  }

  renderItem(text){
    return (
      <ChildComponent copyText={ text }/>
    )
  }

  render() {
    const { text } = this.props;
    return (
      <div>
        <h1>Hello, React!</h1>
        <input name="a" type="text" placeholder="from text" onChange = { this.textFromInput.bind(this) } /><br />
        <input name="a" type="text"  placeholder="to text" value = { text } readOnly="readonly" /><br />
        <ChildComponent copyText={ text }/>
      </div>
    );
  }
}
```

これで動かしてみるとeslintにno-undefとか怒られるはずなので、.eslintrc.jsを以下のように修正し再度"npm run dev"で動画確認できるはずです。
```
'rules': {
  // allow paren-less arrow functions
  'arrow-parens': 0,
  // allow async-await
  'generator-star-spacing': 0,
  'react/jsx-uses-vars': 1,
  // allow debugger during development
  'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  'no-undef': 0,
  'no-console': 0,
}
```

### 子のコンンポーネントからアクションを呼び出してみる
子のコンポーネントにも直接storeで管理しているstateを関連付けて利用することができる。以下の修正を加えることでテキストのstateを空白にするアクションを呼び出すようにすることができる。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SampleAction from '../actions/sample-action';

function mapStateToProps() {
  return {}
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators( Object.assign({}, SampleAction), dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ChildComponent extends Component {
  static propTypes = {
    change_text: PropTypes.func.isRequired,
    copyText: PropTypes.string.isRequired
  }
  static defaultProps = {
    copyText: 'init val'
  }
  constructor(props) {
    super(props);
  }

  clearText() {
    this.props.change_text("")
  }

  render() {
    const { copyText } = this.props;
    return (
      <div>
        <label>{ copyText }</label><br />
        <button onClick = { this.clearText.bind(this) }>クリア</button>
      </div>
    );
  }
}
```
今回は直接storeの値を関連付けるようにしているが、親コンポーネント側で呼び出すアクションなりを変更できるようにしたいのであればpropsとして親のコンポーネントから子のコンポーネントに直接渡せるようにしたら良さそうに思います。

## 表示について
### リストを表示してみる
リストのデータを表示する場合は以下のようになります。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ListComponent extends Component {
  static propTypes = {
    listData: PropTypes.array
  }
  static defaultProps = {
    listData: [{}
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {id: 1, name: "山田一郎"},
        {id: 2, name: "田中二郎"},
        {id: 3, name: "佐藤三郎"}
      ]
    }
  }

  render() {
    const listData = this.state.listData
    return (
      <ul className="user-list">
        {listData.map((user, i) =>
          <div key={i}><li>{ user.name } </li></div>
        )}
      </ul>
    );
  }
}
```

renderの部分は以下のように書き換えることもできる
```
userRender(userList){
  return (
    <ul className="user-list">
      {userList.map((user, i) =>
        <div key={i}><li>{ user.name } </li></div>
      )}
    </ul>
  )
}

render() {
  const listData = this.state.listData
  return (
    <div>
      { this.userRender(listData) }
    </div>
  );
```
または以下のような書き方もできる
```
userRender(userList){
  const userListView = []
  userList.map((user, i) =>
    userListView.push(<div key={i}><li>{ user.name } </li></div>)
  )
  return (
    <ul className="user-list">
      { userListView }
    </ul>
  )
}

render() {
  const listData = this.state.listData
  return (
    <div>
      { this.userRender(listData) }
    </div>
  );
}
```

### webpackのcss-loaderを使ってみる
react,webpackでの環境でスタイルを適用する方法は複数あるのですが、まずはhtmlのheadタグの中にstyleを書き込んですべてのコンポーネントが適用対象にするのがなじみ深いと思いますのでそれから試してみたいと思います。webpackのcss-loaderを使ってbootstrapを読み込むようにしたいと思います。適用するのは簡単でbootstrapからファイル一式をダウンロードしてきて'src/assets/bootstrap'にダウンロードしたすべてのファイルを写した上で"src/main.js"に以下のimportを追加するだけになっております。
```
import './assets/bootstrap/css/bootstrap.min.css'
```
これで動きを見てみるとheadタグの中にstyleが書き込まれているのが分かります。今回はcssで試しましたがsassやstylusもwebpack側で読み込んで使うことができます(別途loader用のプラグインインストールが必要になるかもしれないです)。

### CSS-in-JSを試してみる
Reactではcssをstyle属性として扱っていましてCSS-in-JSはCSSの記法で書いたスクリプトをを直接style属性として扱えるようにするものとなっております。例えば"src/style/sample.css.js"が以下の内容だったとする場合
```
export default {
  ul: {
    listStyle: 'none',
    marginTop: '20px',
    padding: '0px',
    fontSize: '18px',
  },
  span: {
    paddingLeft: '20px',
  }
}
```
コンポーネント側では以下のようにインポートしてstyle属性を設定することができます。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../style/sample.css.js';

export default class ListComponent extends Component {
  static propTypes = {
    listData: PropTypes.array
  }
  static defaultProps = {
    listData: [{}
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {id: 1, name: "山田一郎"},
        {id: 2, name: "田中二郎"},
        {id: 3, name: "佐藤三郎"}
      ]
    }
  }

  render() {
    const listData = this.state.listData
    return (
      <ul style={styles.ul}>
        {listData.map((user, i) =>
          <li key={i}><span>{ user.id }</span><span style={styles.span}>{ user.name } </span></li>
        )}
      </ul>
    );
  }
}
```
またjsのプロパティとして扱っているだけなのでcss用にファイルを分ける必要もなく、以下のようにスタイルを設定することもできます。
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ListComponent extends Component {
  static propTypes = {
    listData: PropTypes.array
  }
  static defaultProps = {
    listData: [{}
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {id: 1, name: "山田一郎"},
        {id: 2, name: "田中二郎"},
        {id: 3, name: "佐藤三郎"}
      ],
      style: {
        ul: {
          listStyle: 'none',
          marginTop: '20px',
          padding: '0px',
          fontSize: '18px',
        },
        span: {
          paddingLeft: '20px',
        }
      }
    }
  }

  render() {
    const listData = this.state.listData
    const style = this.state.style
    return (
      <ul style={style.ul}>
        {listData.map((user, i) =>
          <li key={i}><span>{ user.id }</span><span style={style.span}>{ user.name } </span></li>
        )}
      </ul>
    );
  }
}
```
デザイナーではないので良くわからないのですが、基本的にはcss-loaderの機能だけでスタイルを調整して動的に変更したい場合とかがあったらCSS-in-JSを使うとかの方がシンプルで良さそうな気がしました。
