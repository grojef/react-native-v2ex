import {SiteStatScreenProps as ScreenProps} from '@src/navigation/routes'
import {SylCommon, useTheme} from '@src/theme'
import {AppObject, IState} from '@src/types'
import React, {useEffect, useState} from 'react'
import {View} from 'react-native'
import {connect} from 'react-redux'
import {TableList, TableRow} from '../components'
import {ApiLib} from "@src/api";

const SiteStat = ({
                      siteStat
                  }: ScreenProps & {
    siteStat?: AppObject.SiteStat
}) => {
    const {theme} = useTheme()

    useEffect(() => {
        ApiLib.topic.callStat().then(res => {
            setStat(res)
        })
    }, [])

    const [stat, setStat] = useState<AppObject.CallStat>();

    return (
        <View style={SylCommon.Layout.fill}>
            <TableList title={'今日通话记录'}>
                <TableRow
                    title={'通话次数'}
                    leftIcon={theme.assets.images.icons.table.score}
                    withArrow={false}
                    rightText={`${stat?.today.times}次`}
                />
                <TableRow
                    title={'累计时长'}
                    leftIcon={theme.assets.images.icons.topic.time}
                    withArrow={false}
                    rightText={`${Math.floor((stat?.today.duration ? stat?.today.duration : 0) / 60)}分${(stat?.today.duration ? stat?.today.duration : 0) % 60}秒`}
                />
            </TableList>
            <TableList title={'昨日通话记录'}>
                <TableRow
                    title={'通话次数'}
                    leftIcon={theme.assets.images.icons.table.score}
                    withArrow={false}
                    rightText={`${stat?.yesterday.times}次`}
                />
                <TableRow
                    title={'累计时长'}
                    leftIcon={theme.assets.images.icons.topic.time}
                    withArrow={false}
                    rightText={`${Math.floor((stat?.yesterday.duration ? stat?.yesterday.duration : 0) / 60)}分${(stat?.yesterday.duration ? stat?.yesterday.duration : 0) % 60}秒`}

                />
            </TableList>
            <TableList title={'本周通话记录'}>
                <TableRow
                    title={'通话次数'}
                    leftIcon={theme.assets.images.icons.table.score}
                    withArrow={false}
                    rightText={`${stat?.week.times}次`}
                />
                <TableRow
                    title={'累计时长'}
                    leftIcon={theme.assets.images.icons.topic.time}
                    withArrow={false}
                    rightText={`${Math.floor((stat?.week.duration ? stat?.week.duration : 0) / 60)}分${(stat?.week.duration ? stat?.week.duration : 0) % 60}秒`}
                />
            </TableList>
        </View>
    )
}

const mapStateToProps = ({app: {siteStat}}: { app: IState.AppState }) => {
    return {siteStat}
}

export default connect(mapStateToProps)(SiteStat)
