import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const defaultName = 'Jason';
const defaultUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const defaultTemperature = 22
const defaultFrequence = 1000
const defaultRoomNo = '101'
const defaultASstate = '待机'
const defaultWind = 0
const defaultTotalMoney = 0
const defaultUseTime = 0
const defaultState = '制冷'
const defaultSlaveTemp = 27
const defaultError = 0
const MAXTemp = 31
const defaultTotalEnergy = 0
// const defaultMode = 50

export default new Vuex.Store({
	state: {
		UserInfo: {
			name: defaultName,
			avaterUrl: defaultUrl,
		},
		SlaveState: {
			Basic: {
				RoomNo: defaultRoomNo,
				Temperature: defaultSlaveTemp,
				Frequence: defaultFrequence,
				TotalMoney: defaultTotalMoney,
				TotalEnergy: defaultTotalEnergy,
				UseTime: defaultUseTime,
				ASstate: defaultASstate, // 送风 等待送风 待机 关机
				State: defaultState ,// 制冷 制热
				Wind: defaultWind
			},
			Settings: {
				SetTemperature: defaultTemperature,
			},
			Error: defaultError
		}
	},
	mutations: {
		Login(state, UserInfo) {
			state.UserInfo.name = UserInfo.userName
			state.UserInfo.avaterUrl = UserInfo.avaterUrl
			state.UserInfo.token = UserInfo.token
			state.SlaveState.Basic.RoomNo = UserInfo.roomNo
		},
		Logout(state) {
			state.UserInfo.name = defaultName
			state.UserInfo.avaterUrl = defaultUrl
		},
		SetSlaveState(state, SlaveInfo) {
			var wind = 0
			switch (SlaveInfo.slave.wind) {
				case 'LOW':
					wind = 0
					break;
				case 'MID':
					wind = 50
					break;
				case 'HIGH':
					wind = 100
					break;
				default:
					break;
			}
			state.SlaveState.Settings.SetWind = wind
			state.SlaveState.Settings.SetTemperature = SlaveInfo.slave.targetT
			state.SlaveState.Basic.Temperature = SlaveInfo.temperature
			state.SlaveState.Basic.TotalMoney = SlaveInfo.slave.prevPrice
			state.SlaveState.Basic.TotalEnergy = SlaveInfo.slave.prevP
		},
		UpdateASstate(state, ASstate) {
			state.SlaveState.Basic.ASstate = ASstate
		},
		UpdateSlaveSettings(state, SettingInfo) {
			state.SlaveState.Settings.SetTemperature = SettingInfo.Temp
			state.SlaveState.Settings.SetWind = SettingInfo.Wind
		},
		UpdateSlaveTime(state, time) {
			state.SlaveState.Basic.UseTime = time + state.SlaveState.Basic.UseTime
		},
		UpdateSlaveTemp(state, temp) {
			if (temp <= MAXTemp) state.SlaveState.Basic.Temperature = temp
			else state.SlaveState.Basic.Temperature = MAXTemp
		},
		UpdateSlaveTotal(state, info) {
			console.log('infsds: ' + info.cost)
			state.SlaveState.Basic.TotalMoney = info.cost
			state.SlaveState.Basic.TotalEnergy = info.P
		},
		UpdateSlaveError(state, error) {
			state.SlaveState.Error = error
		}
	}
})
