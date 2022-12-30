import { NotificationInstance } from "antd/es/notification/interface"
import axios from "axios"

export const getCharInfo = async (name: string, id: number, noti: NotificationInstance) => {
    const url = `${process.env.REACT_APP_LOA_HOST}/v3/char/${encodeURI(name)}/electron`    

    try {
        const res = await axios.get(url)
        if (res.status === 200) {
            const info = res.data as CharInfo
            info.id = id
            return info
        }
    } catch {
        noti.error({
            message: "해당하는 캐릭터가 없거나, 인게임 점검 중입니다.",
            description: name
        })
    }

    return {} as CharInfo
}

export const getColor = (quality: number, isDark=false) => {
    if (quality === 100) return "#FF5E00"
    else if (quality >= 90) return "#FF00DD"
    else if (quality >= 70) return "#4A9FF5"
    else return isDark ? "#ecf0f1" : "black" 
}

export const getNotiText = (data: CharInfo) => {
    const EffectStats = data.subEquipInfo.stats.filter(a => a.value > 200)

    return `
Lv.${data.basicInfo.itemLv} ${data.subEquipInfo.imprintSummay} ${data.basicInfo.job}
최대 스포 ${data.basicInfo.maxSkillPt}, 특합 ${EffectStats.reduce((a, b) => a+b.value, 0)}
트포 Lv5 : ${data.tripodInfo.lv5Tripod}/${data.tripodInfo.maxTripod}, Lv4 : ${data.tripodInfo.lv4Tripod}/${data.tripodInfo.maxTripod}
${data.basicInfo.isSafe ? "" : "로스트아크 채널 영구차단 유저입니다."}
`
}