import Taro, { Component } from '@tarojs/taro'
import { AtForm, AtInput, AtTextarea, AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import actions from '../../store/actions/index'

import avatar from '../../asset/img/avatar.png'

@connect((state) => ({
  currentTarget: state.target.currentTarget,
  appUserNum: state.userInfo.appUserNum,
  ossConfig: state.system.ossConfig
}), (dispatch) => ({
  addTarget: (params) => dispatch(actions.addTarget(params)),
  updateTarget: (params) => dispatch(actions.updateTarget(params)),
  deleteTarget: (params) => dispatch(actions.deleteTarget(params)),
  uploadFile: (params) => dispatch(actions.uploadFile(params))
}))
class EditTarget extends Component {
  config = {
    navigationBarTitleText: '新增'
  }
  constructor(props) {
    this.state = {
      targetName: '',
      targetContent: '',
      loading: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onReset = this.onReset.bind(this)
    this.deleteTarget = this.deleteTarget.bind(this)
    this.loading = this.loading.bind(this)
  }

  componentWillMount() {
    const { currentTarget } = this.props
    if (currentTarget) {
      Taro.setNavigationBarTitle({
        title: '编辑'
      })
      this.setState({
        ...currentTarget
      })
    }
  }

  async onSubmit() {
    const {
      targetName,
      targetContent,
    } = this.state

    const { appUserNum, currentTarget, ossConfig, updateTarget, addTarget, uploadFile } = this.props
    this.loading(true)

    uploadFile({
      ...ossConfig,
      key: new Date().getTime(),
      fileName: 'file',
      filePath: avatar,
      resolved: res => {
        if (currentTarget) {
          // 修改
          updateTarget({
            ...currentTarget,
            targetName,
            targetContent,
            appUserNum,
            resolved: (res) => {
              this.loading(false)
              Taro.showToast({
                title: '修改成功',
                icon: 'success',
                complete: () => {
                  setTimeout(() => {
                    Taro.navigateBack()
                  }, 1000);
                }
              })
            },
            rejected: (rej) => {
              this.loading(false)
            }
          })
          
        } else {
          // 新增
          addTarget({
            targetName,
            targetContent,
            appUserNum,
            resolved: (res) => {
              this.loading(false)
              Taro.showToast({
                title: '添加成功',
                icon: 'success',
                complete: () => {
                  setTimeout(() => {
                    Taro.navigateBack()
                  }, 1000);
                }
              })
            },
            rejected: (rej) => {
              this.loading(false)
            }
          })
        }
      },
      rejected: rej => {
        this.loading(false)
        Taro.showToast({
          title: '图片上传失败',
          icon: 'error',
        })
      }
    })    
  }

  onReset() {
    const { currentTarget } = this.props
    if (currentTarget) {
      this.setState({
        ...currentTarget
      })
    } else {
      this.setState({
        targetName: '',
        targetContent: ''
      })
    }
  }

  async deleteTarget() {
    const { currentTarget, deleteTarget } = this.props
    this.setState({
      loading: true
    })
    deleteTarget({
      targetNum: currentTarget.targetNum,
      resolved: (res) => {
        this.setState({
          loading: false
        })
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          complete: () => {
            setTimeout(() => {
              Taro.navigateBack()
            }, 1000);
          }
        })
      },
      rejected: (rej) => {
        this.setState({
          loading: false
        })
      }
    })
  }

  loading(status) {
    this.setState({
      loading: status
    })
  }

  render() {
    const {
      targetName,
      targetContent,
      loading
    } = this.state

    const { currentTarget } = this.props
    
    return (
      <View>
        <AtForm
          onSubmit={this.onSubmit}
          onReset={this.onReset}
        >
          <AtInput 
            title="目标名称"
            value={targetName}
            onChange={(e) => {
              this.setState({
                targetName: e
              })
            }}
          />
          <View
            className="p-3"
          >
            <AtTextarea 
              placeholder="目标内容"
              value={targetContent}
              onChange={(e) => {
                this.setState({
                  targetContent: e
                })
              }}
            />
          </View>
          <AtButton 
            loading={loading} 
            formType='submit'
          >
              提交
          </AtButton>
          <AtButton formType='reset'>重置</AtButton>
          {
            currentTarget ? 
              <AtButton 
                loading={loading} 
                onClick={this.deleteTarget}   
              >
                删除
              </AtButton> : ''
          }
        </AtForm>
      </View>
    )
  }
}

export default EditTarget