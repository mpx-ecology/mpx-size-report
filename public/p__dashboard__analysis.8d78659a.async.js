(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[12],{"14J3":function(e,a,t){"use strict";t("cIOH"),t("1GLa")},BMrR:function(e,a,t){"use strict";var n=t("qrJ5");a["a"]=n["a"]},DnfT:function(e,a,t){},FRQA:function(e,a,t){"use strict";t("GNNt");var n=t("wEI+"),s=(t("DnfT"),t("q1tI")),r=t.n(s),i=t("TSYQ"),c=t.n(i),l=t("jYQm"),o=function(e){var a=Object(s["useContext"])(l["a"]),t=e.children,i=e.contentWidth,o=e.className,u=e.style,d=Object(s["useContext"])(n["b"].ConfigContext),h=d.getPrefixCls,f=e.prefixCls||h("pro"),p=i||a.contentWidth,b="".concat(f,"-grid-content");return r.a.createElement("div",{className:c()(b,o,{wide:"Fixed"===p}),style:u},r.a.createElement("div",{className:"".concat(f,"-grid-content-children")},t))};a["a"]=o},UXoT:function(e,a,t){e.exports={iconGroup:"iconGroup___3RiPi",anticon:"anticon___3NFul",rankingList:"rankingList___2GuWM",rankingItemNumber:"rankingItemNumber___31ZrU",active:"active___3Bsi9",rankingItemTitle:"rankingItemTitle___2Yoy1",salesExtra:"salesExtra___3lIXj",currentDate:"currentDate___7lDDb",salesCard:"salesCard___1Iqf3",salesBar:"salesBar___3JP41",salesRank:"salesRank____67l0",salesCardExtra:"salesCardExtra___1yLFX",salesTypeRadio:"salesTypeRadio___2LyMm",offlineCard:"offlineCard___Oqn6V",trendText:"trendText___3J91q",rankingTitle:"rankingTitle___28H5N",salesExtraWrap:"salesExtraWrap___1k1PZ"}},jCWc:function(e,a,t){"use strict";t("cIOH"),t("1GLa")},jXcd:function(e,a,t){"use strict";t.r(a);t("14J3");var n=t("BMrR"),s=(t("jCWc"),t("kPKH")),r=(t("qVdP"),t("jsC+")),i=(t("lUTK"),t("BvKs")),c=t("fWQN"),l=t("mtLc"),o=t("yKVA"),u=t("879j"),d=t("GZ0F"),h=t("q1tI"),f=t.n(h),p=t("FRQA"),b=t("9kvl"),j=(t("T2oS"),t("W9HT")),m=t("nKUr"),y=function(){return Object(m["jsx"])("div",{style:{paddingTop:100,textAlign:"center"},children:Object(m["jsx"])(j["a"],{size:"large"})})},g=t("wd/R"),_=t.n(g);function v(e){return 1*e<10?"0".concat(e):e}function x(e){var a=new Date,t=864e5;if("today"===e)return a.setHours(0),a.setMinutes(0),a.setSeconds(0),[_()(a),_()(a.getTime()+(t-1e3))];if("week"===e){var n=a.getDay();a.setHours(0),a.setMinutes(0),a.setSeconds(0),0===n?n=6:n-=1;var s=a.getTime()-n*t;return[_()(s),_()(s+(7*t-1e3))]}var r=a.getFullYear();if("month"===e){var i=a.getMonth(),c=_()(a).add(1,"months"),l=c.year(),o=c.month();return[_()("".concat(r,"-").concat(v(i+1),"-01 00:00:00")),_()(_()("".concat(l,"-").concat(v(o+1),"-01 00:00:00")).valueOf()-1e3)]}return[_()("".concat(r,"-01-01 00:00:00")),_()("".concat(r,"-12-31 23:59:59"))]}var T=t("UXoT"),O=t.n(T),k=f.a.lazy((function(){return Promise.all([t.e(0),t.e(2),t.e(4),t.e(22)]).then(t.bind(null,"CqmX"))})),C=f.a.lazy((function(){return Promise.all([t.e(0),t.e(2),t.e(5),t.e(4),t.e(24)]).then(t.bind(null,"qpEo"))})),D=f.a.lazy((function(){return Promise.all([t.e(0),t.e(2),t.e(4),t.e(21)]).then(t.bind(null,"8gNO"))})),S=f.a.lazy((function(){return Promise.all([t.e(0),t.e(2),t.e(4),t.e(23)]).then(t.bind(null,"vvVX"))})),P=function(e){Object(o["a"])(t,e);var a=Object(u["a"])(t);function t(){var e;Object(c["a"])(this,t);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return e=a.call.apply(a,[this].concat(s)),e.state={salesType:"all",currentTabKey:"",rangePickerValue:x("year")},e.reqRef=0,e.timeoutId=0,e.handleChangeSalesType=function(a){e.setState({salesType:a.target.value})},e.handleTabChange=function(a){e.setState({currentTabKey:a})},e.handleRangePickerChange=function(a){var t=e.props.dispatch;e.setState({rangePickerValue:a}),t({type:"dashboardAndanalysis/fetchSalesData"})},e.selectDate=function(a){var t=e.props.dispatch;e.setState({rangePickerValue:x(a)}),t({type:"dashboardAndanalysis/fetchSalesData"})},e.isActive=function(a){var t=e.state.rangePickerValue;if(!t)return"";var n=x(a);return n&&t[0]&&t[1]&&t[0].isSame(n[0],"day")&&t[1].isSame(n[1],"day")?O.a.currentDate:""},e}return Object(l["a"])(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;this.reqRef=requestAnimationFrame((function(){})),e({type:"dashboardAndanalysis/fetch"})}},{key:"componentWillUnmount",value:function(){var e=this.props.dispatch;e({type:"dashboardAndanalysis/clear"}),cancelAnimationFrame(this.reqRef),clearTimeout(this.timeoutId)}},{key:"render",value:function(){var e,a=this.state,t=a.rangePickerValue,c=a.salesType,l=a.currentTabKey,o=this.props,u=o.dashboardAndanalysis,b=o.loading,j=u.visitData,g=(u.visitData2,u.salesData),_=(u.searchData,u.offlineData),v=u.offlineChartData,x=u.salesTypeData,T=u.salesTypeDataOnline,P=u.salesTypeDataOffline,A=u.sizeRes,R=A.sizeSummary;A.groupsSizeInfo;e="all"===c?x:"online"===c?T:P;var I=Object(m["jsxs"])(i["a"],{children:[Object(m["jsx"])(i["a"].Item,{children:"\u64cd\u4f5c\u4e00"}),Object(m["jsx"])(i["a"].Item,{children:"\u64cd\u4f5c\u4e8c"})]}),q=Object(m["jsx"])("span",{className:O.a.iconGroup,children:Object(m["jsx"])(r["a"],{overlay:I,placement:"bottomRight",children:Object(m["jsx"])(d["a"],{})})});console.log(A);var w=l||_[0]&&_[0].name;return Object(m["jsx"])(p["a"],{children:Object(m["jsxs"])(f.a.Fragment,{children:[Object(m["jsx"])(h["Suspense"],{fallback:Object(m["jsx"])(y,{}),children:Object(m["jsx"])(k,{loading:b,visitData:j,sizeSummary:R})}),Object(m["jsx"])(h["Suspense"],{fallback:null,children:Object(m["jsx"])(C,{rangePickerValue:t,salesData:g,isActive:this.isActive,sizeSummary:R,handleRangePickerChange:this.handleRangePickerChange,loading:b,selectDate:this.selectDate})}),Object(m["jsx"])(n["a"],{gutter:24,style:{marginTop:24},children:Object(m["jsx"])(s["a"],{xl:24,lg:24,md:24,sm:24,xs:24,children:Object(m["jsx"])(h["Suspense"],{fallback:null,children:Object(m["jsx"])(D,{dropdownGroup:q,salesType:c,loading:b,sizeSummary:R,salesPieData:e,handleChangeSalesType:this.handleChangeSalesType})})})}),Object(m["jsx"])(h["Suspense"],{fallback:null,children:Object(m["jsx"])(S,{activeKey:w,loading:b,offlineData:_,offlineChartData:v,handleTabChange:this.handleTabChange})})]})})}}]),t}(h["Component"]);a["default"]=Object(b["c"])((function(e){var a=e.dashboardAndanalysis,t=e.loading;return{dashboardAndanalysis:a,loading:t.effects["dashboardAndanalysis/fetch"]}}))(P)},jYQm:function(e,a,t){"use strict";var n=t("q1tI"),s=Object(n["createContext"])({});a["a"]=s},kPKH:function(e,a,t){"use strict";var n=t("/kpp");a["a"]=n["a"]}}]);