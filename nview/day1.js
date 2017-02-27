'use strict';

import React, { Component } from 'react';

import { Platform,ListView,StyleSheet,StatusBar,Text,TouchableHighlight,View } from 'react-native';
import Util from '../view/utils';

class WatchFace extends Component {
	 static propTypes = {
	  sectionTime: React.PropTypes.string.isRequired,
	  totalTime: React.PropTypes.string.isRequired,
	}
  	render() {
    return (
      <View style={styles.watchFaceContaine}>
      	<Text style={styles.sectionTime}>{this.props.sectionTime}</Text>
      	<Text style={styles.totalTime}>{this.props.totalTime}</Text>
      </View>
    );
  }
}

class WatchControl extends Component{
	static propTypes = {
	  startWatch: React.PropTypes.func.isRequired,
	  stopWatch: React.PropTypes.func.isRequired,
	  addRecord: React.PropTypes.func.isRequired,
	  clearRecord: React.PropTypes.func.isRequired,
	};

	constructor(props) {
	  super(props);
	
	  this.state = {
		watchOn: false,
		startBtnText: "启动",
		startBtnColor: "#60B644",
		stopBtnText: "计次",
		underlayColor: "#fff",
	  };
	}

	_startWatch() {
		if (!this.state.watchOn) {
			this.props.startWatch()
			this.setState({
				watchOn: true,
				startBtnText: "停止",
				startBtnColor: "#ff0044",
				stopBtnText: "计次",
				underlayColor: "#eee",
			})
		}else{
			this.props.stopWatch()
			this.setState({
				watchOn: false,
				startBtnText: "启动",
				startBtnColor: "#60B644",
				stopBtnText: "复位",
				underlayColor: "#eee",
			})			
		}
	}

	_addRecord() {
		if (this.state.watchOn) {
			this.props.addRecord()
		}else{
			this.props.clearRecord()
			this.setState({
				stopBtnText: "计次"
			})
		}
	}

	render() {
		return (
			<View style={styles.watchControlContainer}>
				<Text>{this.state.stopBtnText}</Text>
				<Text>{this.state.startBtnText}</Text>
			</View>
		);
	}
}

export default class extends Component {
	
	constructor(props) {
		super(props);
			this.state = {
	        stopWatch: false,
	        resetWatch: true,
	        intialTime: 0,
	        currentTime:0,
	        recordTime:0,
	        timeAccumulation:0,
	        totalTime: "00:00.00",
	        sectionTime: "00:00.00",
	        recordCounter: 0,
	        record:[
	          	{title:"",time:""},
	          	{title:"",time:""},
	         	{title:"",time:""},
	         	{title:"",time:""},
	         	{title:"",time:""},
	         	{title:"",time:""},
	          	{title:"",time:""}
	        ],
   		};
	}
	
	_startWatch(){
		if (this.state.resetWatch) {
			this.setState({
				stopWatch: false,
				resetWatch: false,
				timeAccumulation: 0,
				intialTime:(new Date()).getTime()
			})
		}else{
			this.setState({
				stopWatch:false,
				intialTime:(new Date()).getTime()
			})
		}
		let countingTime,seccountingTime;
		let interval = setInterval(
			() => {
				this.setState({
					currentTime:(new Date()).getTime()
				})
				countingTime = this.state.timeAccumulation + this.state.currentTime - this.state.intialTime;
				seccountingTime = countingTime - this.state.recordTime;
				this.setState({
					totalTime: Util.padLeft(Util.minute(countingTime).toString(),2) + ":" + Util.padLeft(Util.second(countingTime).toString(),2) + ":" + Util.padLeft(Util.milSecond(countingTime).toString(),2),
					sectionTime: Util.padLeft(Util.minute(seccountingTime).toString(),2) + ":" + Util.padLeft(Util.second(seccountingTime).toString(),2) + ":" + Util.padLeft(Util.milSecond(seccountingTime).toString(),2),
				})
				if (this.state.stopWatch) {
					this.setState({
						timeAccumulation:countingTime
					})
					clearInterval(interval)
				};
			}
		,10);
	}

	_stopWatch(){
		this.setState({
			stopWatch: true
		})
	}

	_addRecord(){

	}
	_clearRecord(){

	}


	render() {
	return (
	    <View style={styles.watchContaine}>
	      <WatchFace totalTime="00.00.00" sectionTime="00.00.00" />
	      <WatchControl addRecord={()=>this._addRecord()} clearRecord={()=>this._clearRecord()} startWatch={()=>this._startWatch()} stopWatch={()=>this._stopWatch()}></WatchControl>
	    </View>
	);
	}
}

const styles = StyleSheet.create({
	watchContaine:{
		alignItems: "center",
		backgroundColor: "#f3f3f3",
		marginTop:60,
	},
	watchFaceContaine:{
		width: Util.size.width,
		paddingTop: 50, paddingLeft: 30, paddingRight: 30, paddingBottom:40,
		backgroundColor: "#fff",
		borderBottomWidth:1, borderBottomColor: "#ddd",
		height: 170,
	},
	sectionTime:{
		fontSize: 20,
		fontWeight: "100",
		paddingRight: 30,
		color: "#555",
		position: "absolute",
		left: Util.size.width-140,
		top:30,
	},
	totalTime:{
		fontSize: Util.size.width === 375? 70:60,
		fontWeight: "100",
		color: "#222",
		paddingLeft:20
	},
	watchControlContainer:{
		width: Util.size.width,
		height: 100,
		flexDirection: "row",
		backgroundColor: '#f3f3f3',
		paddingTop: 30, paddingLeft: 60, paddingRight: 60, paddingBottom:0
	}
});