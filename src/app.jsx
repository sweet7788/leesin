import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index/index'
import configStore from './store/index';
import actions from './store/actions/index'

import './style/util.css'
import './app.scss'
import { Provider } from '@tarojs/redux'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  componentDidMount () {
    store.dispatch(actions.getOssConfig())
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'pages/index/index',
      'pages/editTarget/editTarget',
      'pages/pickedRecords/pickedRecords',
      'pages/pickDaily/pickDaily',
      'pages/sharePoster/sharePoster'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
