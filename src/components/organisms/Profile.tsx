import { Card as AntdCard } from 'antd';
import React from 'react'
import { BLUE_TONE } from '../../func/constant';
import { ColumnFlexDiv, RowFlexDiv } from '../atoms/styles';
import Armor from '../molecules/Armor';
import Card from '../molecules/Card';
import Header from '../molecules/Header';
import Jewels from '../molecules/Jewel';
import SubEquip from '../molecules/SubEquip';
import Summary from '../molecules/Summary';
import Weapon from '../molecules/Weapon';

const Profile : React.FC<CharInfo> = (info) => {

    const style = {
      border: `1px solid ${BLUE_TONE}`,
      borderRadius: "8px"
    };
  
    return (
        <div style={style} id={`profile-loa-${info.id}`}>
            <AntdCard.Grid hoverable={false} 
                style={{width: "100%", height: "100%",  boxShadow: 'unset'}}
            >
                <RowFlexDiv style={{
                    alignItems:"stretch"
                }}>
                    <ColumnFlexDiv>                    
                        <Header info={info.basicInfo} id={info.id}/>
                        <Summary {...info}/>
                        <Weapon {...info.equipInfo}/>
                        <Armor {...info.equipInfo}/>
                        <SubEquip {...info.subEquipInfo}/>
                        <Jewels info={info.jewelInfo}/>
                        <Card info={info.cardInfo}/>                   
                    </ColumnFlexDiv>
                </RowFlexDiv>
            </AntdCard.Grid>
        </div>
    )
}

export default Profile