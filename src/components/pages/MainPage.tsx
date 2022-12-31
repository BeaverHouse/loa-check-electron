import { App, Input, Button, Empty, Switch, List } from 'antd';
import { useContext, useState, useRef, useEffect } from 'react';
import addNotification from 'react-push-notification';
import Swal from 'sweetalert2';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { LoaContext } from '../../contexts';
import { getCharInfo, getNotiText } from '../../func/function';
import { BigText, ColumnFlexDiv, RowFlexDiv } from '../atoms/styles';
import Profile from '../organisms/Profile';
import { BLUE_TONE } from '../../func/constant';

const { clipboard } = window.require("electron");
const { Search } = Input;

const announceHTML = `<div class="announce">
  1. 클립보드 ON 상태에서는
  <br/>
  클립보드 데이터가 초기화되니 주의해 주세요.
  <br/>
  <br/>
  2. 집중 지원 설정을 꺼야 알림이 정상적으로 와요.
  <br/>
</div>`

function MainPage() {
    
  const { isDark, toggleDark } = useContext(LoaContext)
  const [SelectedId, setSelectedId] = useState(0)
  const { notification } = App.useApp();
  const [nickname, setNickname] = useState("")
  const [ClipStatus, setClipStatus] = useState(false)
  const [infos, setInfos] = useState([] as CharInfo[])
  const interval  = useRef(0)
 
  const testNoti = () => {
    addNotification({
        title: 'Loa Profile Test',
        message: '알림 테스트입니다.',
        theme: 'darkblue',
        native: true
    });
  };

  const getSimpleMessage = (text: string) => {
    getCharInfo(text, 0, notification).then((data) => {
        const message = getNotiText(data)
        addNotification({
            title: data.basicInfo.nickname,
            message: message,
            duration: 6000,
            theme: 'darkblue',
            native: true
        });
        // 함수형으로 비동기 데이터 업데이트
        setInfos(infos => [data, ...infos].filter((_, idx) => idx < 10))
    })
  }

  const searchNickName = () => {
      getCharInfo(nickname, Math.max(...infos.map(a => a.id), 0) + 1, notification)
      .then((val) => {
        if(val.id) {          
          const message = getNotiText(val)          
          setInfos(infos => [val, ...infos].filter((_, idx) => idx < 10))
          setNickname("")
          addNotification({
            title: val.basicInfo.nickname,
            message: message,
            duration: 6000,
            theme: 'darkblue',
            native: true
          });
          setSelectedId(0)
        }
      })
  }

  const getByClip = () => {
    try {      
      const text = clipboard.readText()
      if (text !== "") getSimpleMessage(text)
    } catch (e) {
    } finally {
      clipboard.writeText("")
    }
  }

  const toggleClip = () => {
      clearInterval(interval.current)
      getByClip()
      if (!ClipStatus) {
        notification.info({
          message: "클립보드 기능이 켜졌어요.\n일정 시간마다 클립보드가 초기화될 거에요."
        })
        interval.current = window.setInterval(getByClip, 3000);
      }
      setClipStatus(!ClipStatus)
  }

  useEffect(() => {
    Swal.fire({
      title: '알림',
      html: announceHTML,
      icon: 'info',
    })
  }, [])
  

  return (
      <ColumnFlexDiv style={{minHeight: "98vh"}}>
        <ColumnFlexDiv>
            <RowFlexDiv style={{margin: "3px"}}>
                <Button onClick={testNoti} shape="round">
                    알림 Test
                </Button>
                <Button type='primary' danger={ClipStatus} onClick={toggleClip} 
                  style={{margin: "5px", marginRight: "50px"}} 
                shape="round">
                    클립보드 {ClipStatus ? "ON" : "OFF"} 상태
                </Button>
                <Switch checked={isDark} onChange={toggleDark}/>&nbsp;&nbsp;다크 모드
            </RowFlexDiv>
        </ColumnFlexDiv>
        <RowFlexDiv>
          <BigText>
            {ClipStatus ? "인게임 이름 복사로 검색을 해 보세요." : "수동으로 검색을 할 수 있어요."}
          </BigText>
          <Search
              placeholder="닉네임"
              value={nickname} 
              allowClear
              disabled = {ClipStatus}
              style={{maxWidth: 200, marginLeft: "20px"}}
              onChange={(e) => setNickname(e.target.value)}
              onSearch={searchNickName}
          />
        </RowFlexDiv>
        <RowFlexDiv style={{margin: "5px auto", justifyContent: "stretch", flexGrow: 1}}>
            { infos.length > 0 ?
              <Profile {...infos[SelectedId]}/>
            : <Empty description={"아직 아무것도 없어요..."}/> }
            <List
              header={<BigText>최근 검색</BigText>}
              bordered
              style={{
                width: "230px",
                marginLeft: "10px"
              }}
              dataSource={infos}
              renderItem={(item, idx) => <List.Item 
                onClick={() => setSelectedId(idx)}
                style={{cursor: "pointer", padding: "10px 5px 10px 5px"}}
              >
                {item.basicInfo.isSafe 
                  ? <CheckCircleOutlined style={{color:isDark ? BLUE_TONE : "green"}}/> 
                  : <WarningOutlined style={{color:"red"}}/>}
                &nbsp;{item.basicInfo.nickname}
              </List.Item>}
            />
        </RowFlexDiv>
      </ColumnFlexDiv>
  )
}

export default MainPage