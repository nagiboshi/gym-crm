(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"8wxC":function(e,t,n){"use strict";n.r(t),n.d(t,"ClassesModule",function(){return Se});var a=n("ofXK"),s=n("tyNb"),i=n("0IaG"),c=n("2Vo4"),l=n("wd/R"),r=n("fXoL"),o=n("3Pt+"),d=n("XgXc"),m=n("XiUz"),h=n("kmnG"),u=n("d3UM"),b=n("qFsG"),g=n("FKr1");function p(e,t){if(1&e&&(r.Tb(0,"mat-option",5),r.Ec(1),r.gc(2,"date"),r.Sb()),2&e){const e=t.$implicit;r.mc("value",e),r.Cb(1),r.Fc(r.jc(2,2,e,"HH:mm","+0000"))}}function f(e,t){if(1&e&&(r.Tb(0,"mat-option",5),r.Ec(1),r.gc(2,"date"),r.Sb()),2&e){const e=t.$implicit;r.mc("value",e),r.Cb(1),r.Fc(r.jc(2,2,e,"HH:mm","+0000"))}}let y=(()=>{class e{constructor(){this.startTimeChanged=new r.o,this.endTimeChanged=new r.o,this.startTimePossibleValues=[],this.endTimePossibleValues=[]}ngOnInit(){if(this.startValue||(this.startValue=0),this.endValue||(this.endValue=8634e4),this.endValue<this.startValue){const e=this.endValue;this.endValue=this.startValue,this.startValue=e}this.interval||(this.interval=9e5);let e=this.startValue;for(;e<this.endValue;)this.startTimePossibleValues.push(e),e+=this.interval}startValueChanged(e){let t=e.value+this.interval;for(;t<this.endValue;)this.endTimePossibleValues.push(t),t+=this.interval;this.startTimeChanged.emit(e.value)}endValueChanged(e){this.endTimeChanged.emit(e.value)}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=r.Hb({type:e,selectors:[["time-range-selector"]],inputs:{startTime:"startTime",startValue:"startValue",endValue:"endValue",interval:"interval"},outputs:{startTimeChanged:"startTimeChanged",endTimeChanged:"endTimeChanged"},decls:6,vars:2,consts:[[1,"time-selection","from-time-select"],["placeholder","From",3,"selectionChange"],[3,"value",4,"ngFor","ngForOf"],[1,"time-selection","to-time-select"],["placeholder","To",3,"selectionChange"],[3,"value"]],template:function(e,t){1&e&&(r.Tb(0,"mat-form-field",0),r.Tb(1,"mat-select",1),r.bc("selectionChange",function(e){return t.startValueChanged(e)}),r.Dc(2,p,3,6,"mat-option",2),r.Sb(),r.Sb(),r.Tb(3,"mat-form-field",3),r.Tb(4,"mat-select",4),r.bc("selectionChange",function(e){return t.endValueChanged(e)}),r.Dc(5,f,3,6,"mat-option",2),r.Sb(),r.Sb()),2&e&&(r.Cb(2),r.mc("ngForOf",t.startTimePossibleValues),r.Cb(3),r.mc("ngForOf",t.endTimePossibleValues))},directives:[h.c,u.a,a.m,g.l],pipes:[a.f],styles:[".time-selection.to-time-select{margin-left:10px}"],encapsulation:2}),e})();var C=n("iadO"),S=n("bTqV"),T=n("znSr");function v(e,t){if(1&e&&(r.Tb(0,"mat-option",17),r.Ec(1),r.Sb()),2&e){const e=t.$implicit;r.mc("value",e),r.Cb(1),r.Fc(e.name)}}const D=function(e){return{day:!0,"selected-day":e}};function x(e,t){if(1&e){const e=r.Ub();r.Tb(0,"div",18),r.bc("click",function(){r.xc(e);const n=t.$implicit;return r.fc().toggleDay(n.key)}),r.Ec(1),r.Sb()}if(2&e){const e=t.$implicit,n=r.fc();r.mc("ngClass",r.pc(2,D,n.isDaySelected(e.key))),r.Cb(1),r.Gc(" ",e.value,"")}}function M(e,t){1&e&&(r.Tb(0,"mat-error"),r.Ec(1,"Please select at least one day"),r.Sb())}function w(e,t){1&e&&(r.Tb(0,"mat-error"),r.Ec(1,"Capacity should be positive number"),r.Sb())}function k(e,t){1&e&&(r.Tb(0,"mat-error"),r.Ec(1,"Plese pick start time"),r.Sb())}function O(e,t){1&e&&(r.Tb(0,"mat-error"),r.Ec(1,"Please pick end time"),r.Sb())}const I=function(e,t,n,a,s,i,c){return{scheduleFrom:e,scheduleUntil:t,capacity:n,days:a,selectedClass:s,startTime:i,endTime:c}},E=l;let F=(()=>{class e{constructor(e,t,n){this.day=e,this.fb=t,this.communicationService=n,this.selectedDays=new c.a([]),this.startTime=-1,this.endTime=-1,this.capacity=10}ngOnInit(){const e=E();e.add(1,"month"),e.subtract((new Date).getDay(),"days"),this.scheduleFromDate=E(),this.scheduleUntilDate=e,this.dayMappings=this.communicationService.getDayMappings(),this.existingClasses=this.communicationService.getClasses(),this.day&&this.selectedDays.next([...this.selectedDays.getValue(),parseInt(this.day,10)])}isDaySelected(e){return-1!=this.selectedDays.getValue().findIndex(t=>t==parseInt(e,10))}toggleDay(e){const t=parseInt(e,10),n=this.selectedDays.getValue().findIndex(e=>e==t);if(-1==n)this.selectedDays.next([...this.selectedDays.getValue(),t]);else{const e=[...this.selectedDays.getValue()];e.splice(n,1),this.selectedDays.next(e)}}isValid(){return this.selectedDays.getValue().length>0&&this.startTime&&this.endTime&&this.selectedClass&&this.capacity>0}setStartTime(e){this.startTime=e}setEndTime(e){this.endTime=e}}return e.\u0275fac=function(t){return new(t||e)(r.Nb(i.a),r.Nb(o.f),r.Nb(d.a))},e.\u0275cmp=r.Hb({type:e,selectors:[["app-add-schedule-dialog"]],decls:32,vars:25,consts:[["fxLayout","column",1,"schedule-row"],[3,"placeholder","ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],["fxLayout","row","fxLayoutGap","10px"],[3,"ngClass","click",4,"ngFor","ngForOf"],[4,"ngIf"],["type","number","matInput","","placeholder","Class capacity",3,"ngModel","ngModelChange"],[1,"schedule-row"],[3,"startTimeChanged","endTimeChanged"],["fxFlex","100",1,"schedule-until-datepicker"],[3,"rangePicker"],["matStartDate","","placeholder","Start date",3,"ngModel","ngModelChange"],["matEndDate","","placeholder","End date",3,"ngModel","ngModelChange"],["matSuffix","",3,"for"],["picker",""],["mat-dialog-close","","mat-button",""],["color","primary","mat-button","",3,"disabled","matDialogClose"],[3,"value"],[3,"ngClass","click"]],template:function(e,t){if(1&e&&(r.Tb(0,"div",0),r.Tb(1,"mat-form-field"),r.Tb(2,"mat-select",1),r.bc("ngModelChange",function(e){return t.selectedClass=e}),r.Dc(3,v,2,2,"mat-option",2),r.Sb(),r.Sb(),r.Sb(),r.Tb(4,"div",0),r.Tb(5,"div",3),r.Dc(6,x,2,4,"div",4),r.gc(7,"keyvalue"),r.Sb(),r.Dc(8,M,2,0,"mat-error",5),r.Sb(),r.Tb(9,"div",0),r.Tb(10,"mat-form-field"),r.Tb(11,"input",6),r.bc("ngModelChange",function(e){return t.capacity=e}),r.Sb(),r.Dc(12,w,2,0,"mat-error",5),r.Sb(),r.Sb(),r.Tb(13,"div",7),r.Tb(14,"time-range-selector",8),r.bc("startTimeChanged",function(e){return t.setStartTime(e)})("endTimeChanged",function(e){return t.setEndTime(e)}),r.Sb(),r.Dc(15,k,2,0,"mat-error",5),r.Dc(16,O,2,0,"mat-error",5),r.Sb(),r.Tb(17,"div",7),r.Tb(18,"mat-form-field",9),r.Tb(19,"mat-label"),r.Ec(20,"Schedule From - Until"),r.Sb(),r.Tb(21,"mat-date-range-input",10),r.Tb(22,"input",11),r.bc("ngModelChange",function(e){return t.scheduleFromDate=e}),r.Sb(),r.Tb(23,"input",12),r.bc("ngModelChange",function(e){return t.scheduleUntilDate=e}),r.Sb(),r.Sb(),r.Ob(24,"mat-datepicker-toggle",13),r.Ob(25,"mat-date-range-picker",null,14),r.Sb(),r.Sb(),r.Tb(27,"div",7),r.Tb(28,"button",15),r.Ec(29,"Cancel"),r.Sb(),r.Tb(30,"button",16),r.Ec(31,"Save "),r.Sb(),r.Sb()),2&e){const e=r.uc(26);r.Cb(2),r.mc("placeholder","Select class")("ngModel",t.selectedClass),r.Cb(1),r.mc("ngForOf",t.existingClasses),r.Cb(3),r.mc("ngForOf",r.hc(7,15,t.dayMappings)),r.Cb(2),r.mc("ngIf",0==t.selectedDays.value.length),r.Cb(3),r.mc("ngModel",t.capacity),r.Cb(1),r.mc("ngIf",t.capacity<=0),r.Cb(3),r.mc("ngIf",-1==t.startTime),r.Cb(1),r.mc("ngIf",-1==t.endTime),r.Cb(5),r.mc("rangePicker",e),r.Cb(1),r.mc("ngModel",t.scheduleFromDate),r.Cb(1),r.mc("ngModel",t.scheduleUntilDate),r.Cb(1),r.mc("for",e),r.Cb(6),r.mc("disabled",!t.isValid())("matDialogClose",r.sc(17,I,null==t.scheduleFromDate?null:t.scheduleFromDate.toDate().getTime(),null==t.scheduleUntilDate?null:t.scheduleUntilDate.toDate().getTime(),t.capacity,t.selectedDays.getValue(),t.selectedClass,t.startTime,t.endTime))}},directives:[m.c,h.c,u.a,o.p,o.s,a.m,m.d,a.n,o.t,b.b,o.c,y,m.a,h.g,C.e,C.l,C.k,C.j,h.h,C.f,S.b,i.d,g.l,a.l,T.a,h.b],pipes:[a.h],styles:[".to-time-select[_ngcontent-%COMP%]{margin-left:10px}.schedule-row[_ngcontent-%COMP%]{margin-top:10px}.schedule-until-datepicker[_ngcontent-%COMP%]   .mat-form-field-appearance-fill[_ngcontent-%COMP%]{background:#fff}.day[_ngcontent-%COMP%]{cursor:pointer;padding:3px}.day.selected-day[_ngcontent-%COMP%]{border:1px solid rgba(0,117,169,.8)}"]}),e})();var P=n("LvDl"),_=n("vkho"),V=n("9dXC"),$=n("QxcC"),L=n("+0xr"),N=n("Qu3c"),H=n("NFeN"),j=n("1ybu");function A(e,t){1&e&&(r.Tb(0,"th",20),r.Ec(1," Name"),r.Sb())}function U(e,t){1&e&&(r.Tb(0,"span",24),r.Ec(1,"!"),r.Sb())}function G(e,t){if(1&e&&(r.Tb(0,"td",21),r.Dc(1,U,2,0,"span",22),r.Tb(2,"a",23),r.Ec(3),r.Sb(),r.Sb()),2&e){const e=t.$implicit;r.mc("ngClass","sign-in-member"),r.Cb(1),r.mc("ngIf",e.activeMembership.isNearlyExpire),r.Cb(1),r.nc("routerLink","/members/",e.scheduleMember.member.id,""),r.Cb(1),r.Fc(e.scheduleMember.member.firstName+" "+e.scheduleMember.member.lastName)}}function R(e,t){1&e&&(r.Tb(0,"th",20),r.Ec(1," Package"),r.Sb())}function W(e,t){if(1&e&&(r.Tb(0,"td",25),r.Ec(1),r.Sb()),2&e){const e=t.$implicit;r.Cb(1),r.Gc(" ",e.activeMembership.item.name," ")}}function X(e,t){1&e&&(r.Tb(0,"th",20),r.Ec(1," Expiry Date"),r.Sb())}function Q(e,t){if(1&e&&(r.Tb(0,"td",25),r.Ec(1),r.gc(2,"membershipExpiration"),r.Sb()),2&e){const e=t.$implicit;r.Cb(1),r.Gc(" ",r.ic(2,1,e.activeMembership.item,e.activeMembership.startDate)," ")}}function B(e,t){1&e&&r.Ob(0,"th",20)}const Y=function(){return{"sell-button":!0}};function z(e,t){if(1&e){const e=r.Ub();r.Tb(0,"mat-icon",27),r.bc("click",function(){r.xc(e);const t=r.fc().$implicit;return r.fc().openSellDialog(t)}),r.Ec(1," attach_money "),r.Sb()}2&e&&r.mc("ngClass",r.oc(1,Y))}function J(e,t){if(1&e&&(r.Tb(0,"td",25),r.Dc(1,z,2,2,"mat-icon",26),r.Sb()),2&e){const e=t.$implicit;r.Cb(1),r.mc("ngIf",e.activeMembership.isExpired||e.activeMembership.isNearlyExpire)}}function K(e,t){1&e&&r.Ob(0,"tr",28)}function q(e,t){1&e&&r.Ob(0,"tr",29)}const Z=function(e){return{warn:e}},ee=l;let te=(()=>{class e{constructor(e,t,n,a){this.signInDialogData=e,this.communicationService=t,this.router=n,this.dialog=a,this.today=ee(),this.displayedColumns=["fullName","package","expiryDate","sell"]}ngOnInit(){this.scheduleMembers=[...this.signInDialogData.daySchedule.signedMembers$.getValue()],this.purchaseItems=[...this.signInDialogData.purchaseItems].map(e=>Object(_.a)(e,this.today),ee()),this.memberIdToPurchaseItem=Object(P.groupBy)(this.purchaseItems,"memberId"),this.signInMembers=this.scheduleMembers.map(e=>this.scheduleMemberToSignInMember(e))}scheduleMemberToSignInMember(e){return{scheduleMember:e,activeMembership:this.getLatestPurchase(this.memberIdToPurchaseItem[e.member.id])}}getLatestPurchase(e){const t=Object(P.sortBy)(e,e=>ee(e.startDate).add(e.item.expirationLength,e.item.expirationType).toDate().getTime(),["desc"]);return t&&t.length>0?Object(_.a)(Object(P.first)(t),this.today):null}removeFromSchedule(e){Object(P.remove)(this.scheduleMembers,t=>t.member.firstName==e.member.firstName&&t.member.lastName==e.member.lastName)}memberToScheduleMember(e,t,n){return{scheduleDate:n.toDate().getTime(),member:t,id:0}}addMemberToSchedule(e){if(-1!=this.scheduleMembers.findIndex(t=>t.member.id==e.id))return;const t=this.memberToScheduleMember(this.signInDialogData.daySchedule,e,this.signInDialogData.signInDate);this.scheduleMembers.push(t);const n=this.scheduleMemberToSignInMember(t);this.signInMembers=[n,...this.signInMembers]}openSellDialog(e){const t=e.scheduleMember.member.id;this.dialog.open(V.a,{data:t}).afterClosed().subscribe(n=>{n&&this.communicationService.savePurchase(n).toPromise().then(n=>{const a=Object(_.a)(n,this.today);this.purchaseItems.push(a),this.memberIdToPurchaseItem[t].push(a),e.activeMembership=a,this.communicationService.newPurchase.next(n)})})}}return e.\u0275fac=function(t){return new(t||e)(r.Nb(i.a),r.Nb(d.a),r.Nb(s.c),r.Nb(i.b))},e.\u0275cmp=r.Hb({type:e,selectors:[["app-sign-in-dialog"]],decls:47,vars:26,consts:[["fxFill","","fxLayout","column"],["fxLayout","column"],[1,"sign-in-title"],["fxLayout","row",1,"sign-in-dialog-row"],[1,"sign-in-label"],[3,"ngClass"],["fxFlex","",3,"clearAfterSelection","labelColor","placeholder","memberSelected"],["mat-table","",3,"dataSource"],["matColumnDef","fullName"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",3,"ngClass",4,"matCellDef"],["matColumnDef","package"],["mat-cell","",4,"matCellDef"],["matColumnDef","expiryDate"],["matColumnDef","sell"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],[1,"control-buttons"],["color","primary","mat-raised-button","",3,"mat-dialog-close"],["mat-button","","mat-dialog-close",""],["mat-header-cell",""],["mat-cell","",3,"ngClass"],["matTooltip","Membership is nearly expired","class","nearly-expired-membership",4,"ngIf"],[3,"routerLink"],["matTooltip","Membership is nearly expired",1,"nearly-expired-membership"],["mat-cell",""],[3,"ngClass","click",4,"ngIf"],[3,"ngClass","click"],["mat-header-row",""],["mat-row",""]],template:function(e,t){1&e&&(r.Tb(0,"div",0),r.Tb(1,"div",1),r.Tb(2,"h1",2),r.Ec(3),r.Sb(),r.Tb(4,"div",3),r.Tb(5,"span",4),r.Ec(6,"Date:"),r.Sb(),r.Tb(7,"div"),r.Ec(8),r.gc(9,"date"),r.Sb(),r.Sb(),r.Tb(10,"div",3),r.Tb(11,"span",4),r.Ec(12,"Time:"),r.Sb(),r.Tb(13,"div"),r.Ec(14),r.gc(15,"date"),r.gc(16,"date"),r.Sb(),r.Sb(),r.Tb(17,"div",3),r.Tb(18,"span",4),r.Ec(19,"Capacity:"),r.Sb(),r.Tb(20,"span",5),r.Ec(21),r.Sb(),r.Ec(22),r.Sb(),r.Tb(23,"div",3),r.Tb(24,"span",4),r.Ec(25,"Sign in:"),r.Sb(),r.Tb(26,"app-find-member",6),r.bc("memberSelected",function(e){return t.addMemberToSchedule(e)}),r.Sb(),r.Sb(),r.Tb(27,"table",7),r.Rb(28,8),r.Dc(29,A,2,0,"th",9),r.Dc(30,G,4,4,"td",10),r.Qb(),r.Rb(31,11),r.Dc(32,R,2,0,"th",9),r.Dc(33,W,2,1,"td",12),r.Qb(),r.Rb(34,13),r.Dc(35,X,2,0,"th",9),r.Dc(36,Q,3,4,"td",12),r.Qb(),r.Rb(37,14),r.Dc(38,B,1,0,"th",9),r.Dc(39,J,2,1,"td",12),r.Qb(),r.Dc(40,K,1,0,"tr",15),r.Dc(41,q,1,0,"tr",16),r.Sb(),r.Tb(42,"div",17),r.Tb(43,"button",18),r.Ec(44,"Save"),r.Sb(),r.Tb(45,"button",19),r.Ec(46,"Cancel"),r.Sb(),r.Sb(),r.Sb(),r.Sb()),2&e&&(r.Cb(3),r.Gc("Sign in to ",t.signInDialogData.daySchedule.primalClass.name,": "),r.Cb(5),r.Fc(r.hc(9,14,t.signInDialogData.signInDate.toDate())),r.Cb(6),r.Hc("",r.jc(15,16,t.signInDialogData.daySchedule.timeStart,"HH:mm","+0000")," - ",r.jc(16,20,t.signInDialogData.daySchedule.timeEnd,"HH:mm","+0000"),""),r.Cb(6),r.mc("ngClass",r.pc(24,Z,t.scheduleMembers.length>t.signInDialogData.daySchedule.capacity)),r.Cb(1),r.Fc(t.scheduleMembers.length),r.Cb(1),r.Gc("\xa0 of ",t.signInDialogData.daySchedule.capacity,""),r.Cb(4),r.mc("clearAfterSelection",!0)("labelColor",0)("placeholder","First, Last name of phone number "),r.Cb(1),r.mc("dataSource",t.signInMembers),r.Cb(13),r.mc("matHeaderRowDef",t.displayedColumns),r.Cb(1),r.mc("matRowDefColumns",t.displayedColumns),r.Cb(2),r.mc("mat-dialog-close",t.scheduleMembers))},directives:[m.e,m.c,a.l,T.a,$.a,m.a,L.k,L.c,L.e,L.b,L.g,L.j,S.b,i.d,L.d,L.a,a.n,s.e,N.a,H.a,L.f,L.i],pipes:[a.f,j.a],styles:[".signed-member-row[_ngcontent-%COMP%]{cursor:pointer;height:24px}.signed-member-row[_ngcontent-%COMP%]:hover{background-color:rgba(0,117,169,.1)}.signed-member-row[_ngcontent-%COMP%]   .unsign-user-icon[_ngcontent-%COMP%]{padding:0;display:none}.signed-member-row[_ngcontent-%COMP%]:hover   .unsign-user-icon[_ngcontent-%COMP%]{display:block}.control-buttons[_ngcontent-%COMP%]{margin-top:10px}.sign-in-title[_ngcontent-%COMP%]{padding-left:24px}.sign-in-dialog-row[_ngcontent-%COMP%]{height:40px}.sign-in-dialog-row[_ngcontent-%COMP%]   .sign-in-label[_ngcontent-%COMP%]{padding-left:24px;height:40px;display:block;width:120px;min-width:120px;margin-right:15px}table[_ngcontent-%COMP%]{margin-top:20px;width:100%}table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td.mat-cell[_ngcontent-%COMP%]{border-bottom-color:transparent}.sell-button[_ngcontent-%COMP%]{cursor:pointer}.sign-in-member[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:rgba(0,0,0,.87);text-decoration:none}.sign-in-member[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}.nearly-expired-membership[_ngcontent-%COMP%]{font-size:20px;color:red;margin-right:15px;cursor:pointer}"]}),e})();var ne=n("XNiG");let ae=(()=>{class e{constructor(){this.strategyChanged$=new c.a("week"),this.selectMonth=new ne.a,this.selectMonth$=this.selectMonth.asObservable()}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=r.Jb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})(),se=(()=>{class e{constructor(e,t){this._dateAdapter=e,this.selectionStrategyEventEmitter=t}selectionFinished(e){return this._createRange(e,this.selectionStrategyEventEmitter.strategyChanged$.getValue())}createPreview(e){return this._createRange(e,"week")}_createRange(e,t){if(e){let n,a;const s=e;return"week"==t?(n=s.clone().startOf("week"),a=s.clone().endOf("week")):(n=s.clone().startOf("month"),a=s.clone().endOf("month")),new C.a(n,a)}return new C.a(null,null)}}return e.\u0275fac=function(t){return new(t||e)(r.Xb(g.c),r.Xb(ae))},e.\u0275prov=r.Jb({token:e,factory:e.\u0275fac}),e})();var ie=n("1G5W");function ce(e,t){if(1&e&&(r.Tb(0,"mat-option",6),r.Ec(1),r.Sb()),2&e){const e=t.$implicit;r.mc("value",e),r.Cb(1),r.Fc(e)}}function le(e,t){if(1&e&&(r.Tb(0,"mat-option",6),r.Ec(1),r.Sb()),2&e){const e=t.$implicit;r.mc("value",e),r.Cb(1),r.Fc(e)}}const re=l;let oe=(()=>{class e{constructor(e,t,n,a,s){this._calendar=e,this._dateAdapter=t,this.selectionStrategyEventEmitter=n,this._dateFormats=a,this._destroyed=new ne.a,this.selectionStrategy="week",e.stateChanges.pipe(Object(ie.a)(this._destroyed)).subscribe(()=>{s.markForCheck()});const i=this._calendar.activeDate;this.years=Object(P.range)(i.clone().subtract(10,"year").year(),i.clone().add(10,"year").year()),this.months=re.months(),this.selectedYear=i.year(),this.selectedMonth=this.months[i.month()]}yearChanged(e){const t=this._calendar.activeDate.clone();t.year(e),this._calendar.activeDate=t}monthChanged(e){const t=this._calendar.activeDate.clone();t.month(e),this._calendar.activeDate=t}ngOnDestroy(){this._destroyed.next(),this._destroyed.complete()}get periodLabel(){return this._dateAdapter.format(this._calendar.activeDate,this._dateFormats.display.monthYearLabel).toLocaleUpperCase()}selectMonth(){this.selectionStrategyEventEmitter.selectMonth.next()}}return e.\u0275fac=function(t){return new(t||e)(r.Nb(C.d),r.Nb(g.c),r.Nb(ae),r.Nb(g.e),r.Nb(r.h))},e.\u0275cmp=r.Hb({type:e,selectors:[["schedule-calendar-header"]],decls:9,vars:4,consts:[[1,"schedule-calendar-header"],["appearance","none"],["placeholder","Year",1,"year-selection",3,"value","valueChange"],[3,"value",4,"ngFor","ngForOf"],["placeholder","Month",3,"value","valueChange"],[1,"select-full-month",3,"click"],[3,"value"]],template:function(e,t){1&e&&(r.Tb(0,"div",0),r.Tb(1,"mat-form-field",1),r.Tb(2,"mat-select",2),r.bc("valueChange",function(e){return t.yearChanged(e)}),r.Dc(3,ce,2,2,"mat-option",3),r.Sb(),r.Sb(),r.Tb(4,"mat-form-field",1),r.Tb(5,"mat-select",4),r.bc("valueChange",function(e){return t.monthChanged(e)}),r.Dc(6,le,2,2,"mat-option",3),r.Sb(),r.Tb(7,"mat-hint",5),r.bc("click",function(){return t.selectMonth()}),r.Ec(8,"Select all month"),r.Sb(),r.Sb(),r.Sb()),2&e&&(r.Cb(2),r.mc("value",t.selectedYear),r.Cb(1),r.mc("ngForOf",t.years),r.Cb(2),r.mc("value",t.selectedMonth),r.Cb(1),r.mc("ngForOf",t.months))},directives:[h.c,u.a,a.m,h.f,g.l],styles:[".schedule-calendar-header[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      padding: 0.5em;\n    }\n\n    .schedule-calendar-header[_ngcontent-%COMP%]{\n      min-width: 360px;\n    }\n\n    .select-full-month[_ngcontent-%COMP%]{\n      cursor: pointer;\n      color: rgba(0, 117, 169, 0.8);\n    }\n\n    .year-selection[_ngcontent-%COMP%] {\n        width: 80px;\n    }"],changeDetection:0}),e})();function de(e,t){if(1&e){const e=r.Ub();r.Tb(0,"div",14),r.Tb(1,"div",15),r.bc("click",function(){r.xc(e);const n=t.$implicit;return r.fc(3).signIn(n)}),r.Tb(2,"div",16),r.Ec(3),r.gc(4,"date"),r.Sb(),r.Tb(5,"span",17),r.Ec(6,"\u2014"),r.Sb(),r.Tb(7,"div",18),r.Ec(8),r.gc(9,"date"),r.Sb(),r.Sb(),r.Tb(10,"div",19),r.bc("click",function(){r.xc(e);const n=t.$implicit;return r.fc(3).signIn(n)}),r.Tb(11,"span",20),r.Ec(12),r.Sb(),r.Sb(),r.Tb(13,"div",21),r.bc("click",function(){r.xc(e);const n=t.$implicit;return r.fc(3).signIn(n)}),r.Ec(14),r.Sb(),r.Tb(15,"button",22),r.bc("click",function(){r.xc(e);const n=t.$implicit;return r.fc(3).remove(n)}),r.Tb(16,"mat-icon"),r.Ec(17,"delete"),r.Sb(),r.Sb(),r.Sb()}if(2&e){const e=t.$implicit;r.Cb(3),r.Gc(" ",r.jc(4,6,e.timeStart,"HH:mm","+0000")," "),r.Cb(5),r.Gc(" ",r.jc(9,10,e.timeEnd,"HH:mm","+0000")," "),r.Cb(4),r.Hc("",e.signedMembers$.value.length," of ",e.capacity,""),r.Cb(2),r.Gc(" ",e.primalClass.name," "),r.Cb(1),r.mc("ngClass","remove-schedule")}}const me=function(){return{"daily-schedule":!0}},he=function(e){return{"highlighted-day":e,"schedule-date":!0}};function ue(e,t){if(1&e&&(r.Tb(0,"div",9),r.Tb(1,"div",10),r.Tb(2,"div",11),r.Ec(3),r.Sb(),r.Tb(4,"div",9),r.Ec(5),r.gc(6,"date"),r.Sb(),r.Sb(),r.Tb(7,"div",12),r.Dc(8,de,18,14,"div",13),r.Sb(),r.Sb()),2&e){const e=t.$implicit,n=r.fc().ngIf,a=r.fc();r.mc("ngClass",r.oc(7,me)),r.Cb(3),r.Fc(e.label),r.Cb(1),r.mc("ngClass",r.pc(8,he,e.date.getDate()==a.today.getDate()&&e.date.getFullYear()==a.today.getFullYear()&&e.date.getMonth()==e.date.getMonth())),r.Cb(1),r.Fc(r.hc(6,5,e.date)),r.Cb(3),r.mc("ngForOf",a.groupSchedulesByDay(e.day.toString(),n))}}function be(e,t){if(1&e&&(r.Rb(0),r.Dc(1,ue,9,10,"div",8),r.Qb()),2&e){const e=r.fc();r.Cb(1),r.mc("ngForOf",e.scheduleWeekDays)}}const ge=l;let pe=(()=>{class e{constructor(e,t,n,a){this.communicationService=e,this.cd=t,this.dialog=n,this.selectionStrategyEventEmitter=a,this.today=new Date,this.schedules$=new c.a([]),this.purchaseItems$=new c.a([]),this.scheduleCalendarHeader=oe,this.subscriptions=[],this.sortSchedulesFunction=(e,t)=>e.timeStart>t.timeStart?1:e.timeStart<t.timeStart?-1:0}ngOnDestroy(){this.subscriptions.forEach(e=>e.unsubscribe())}updateScheduleWeekDates(e){this.scheduleWeekDays=[];const t=e.start.clone(),n=e.end.clone(),a=ge();let s,i;if(t.month()!=n.month()){s=t.date(),i=t.daysInMonth();for(let e=s;e<=i;e++){const n=a.month(t.month()).date(e);this.scheduleWeekDays.push({day:n.date(),label:ge.weekdaysShort()[n.day()],date:n.toDate()})}s=1,i=n.date(),a.month(n.month())}else s=t.date(),i=n.date();for(let c=s;c<=i;c++){const e=a.date(c);this.scheduleWeekDays.push({day:e.day(),label:ge.weekdaysShort()[e.day()],date:e.toDate()})}}getSchedules(e,t){return this.communicationService.getSchedules(e.toDate(),t.toDate())}ngOnInit(){this.classes=this.communicationService.getClasses();const e=ge(new Date),t=ge(new Date),n=e.startOf("week"),a=t.endOf("week");this.scheduleDate=new C.a(n,a),this.updateScheduleWeekDates(this.scheduleDate),this.getSchedules(n,a).subscribe(e=>{this.schedules$.next(e)}),this.subscriptions.push(this.communicationService.newPurchase$.subscribe(e=>{this.purchaseItems$.next([e,...this.purchaseItems$.getValue()])})),this.communicationService.getPurchaseItems(n.toDate().getTime(),a.toDate().getTime()).subscribe(e=>{this.purchaseItems$.next(e)}),this.subscriptions.push(this.selectionStrategyEventEmitter.selectMonth$.subscribe(()=>{this.filterScheduleDates(this.calendar.activeDate,"month")}))}filterScheduleDates(e,t){const n=e.clone();let a,s;switch(t||(t=this.selectionStrategyEventEmitter.strategyChanged$.getValue()),t){case"week":a=e.startOf("week"),s=n.endOf("week");break;case"month":a=e.startOf("month"),s=n.endOf("month")}this.scheduleDate=new C.a(a,s),this.updateScheduleWeekDates(this.scheduleDate),this.getSchedules(a,s).subscribe(e=>{this.schedules$.next(e)})}signIn(e){const t=this.scheduleDate.start.clone().add(e.dayOfWeek,"days").startOf("day").add(e.timeStart,"milliseconds");this.dialog.open(te,{width:"800px",data:{daySchedule:e,signInDate:t,purchaseItems:this.purchaseItems$.getValue()}}).afterClosed().subscribe(n=>{if((n=n||e.signedMembers$.getValue())&&n){const a=Object(P.differenceBy)(n,e.signedMembers$.getValue(),e=>e.member.id).map(e=>e.member.id);this.communicationService.signIn(e.scheduleId,a,t.toDate().getTime()).toPromise().then(t=>{e.signedMembers$.next([...t,...e.signedMembers$.getValue()]),this.cd.markForCheck()})}})}groupSchedulesByDay(e,t){return t.filter(t=>t.day==parseInt(e,10)).sort(this.sortSchedulesFunction).map(e=>({scheduleId:e.id,dayOfWeek:e.day,timeStart:e.timeStart,timeEnd:e.timeEnd,capacity:e.capacity,signedMembers$:new c.a(e.signedMembers||[]),primalClass:this.classes.find(t=>t.id==e.classId)}))}addSchedule(e){this.dialog.open(F).afterClosed().subscribe(e=>{if(e){const t=e.days.map(t=>({id:0,timeStart:e.startTime,timeEnd:e.endTime,classId:e.selectedClass.id,scheduleFrom:e.scheduleFrom,scheduleUntil:e.scheduleUntil,signedMembers:[],day:t,capacity:e.capacity}));this.communicationService.addSchedules(t).subscribe(e=>{const t=[...this.schedules$.getValue(),...e];t.sort(this.sortSchedulesFunction),this.schedules$.next(t)})}})}remove(e){console.log(e)}}return e.\u0275fac=function(t){return new(t||e)(r.Nb(d.a),r.Nb(r.h),r.Nb(i.b),r.Nb(ae))},e.\u0275cmp=r.Hb({type:e,selectors:[["app-classes"]],viewQuery:function(e,t){if(1&e&&r.Ic(C.d,1),2&e){let e;r.tc(e=r.cc())&&(t.calendar=e.first)}},features:[r.Bb([{provide:C.b,useClass:se},C.c])],decls:11,vars:5,consts:[["fxLayoutAlign","space-between"],["fxFlex","60",1,"schedule-list"],[4,"ngIf"],["fxFlex","40"],["id","schedule-datepicker","fxLayout","column","fxLayoutAlign","space-between"],[3,"headerComponent","selected","selectedChange"],["fxLayoutAlign","end","id","add-schedule-container"],["id","add-schedule","mat-fab","","color","primary",3,"click"],[3,"ngClass",4,"ngFor","ngForOf"],[3,"ngClass"],["fxLayoutAlign","start center",1,"day-of-week"],["fxLayoutAlign","center center",1,"day"],[1,"class-schedules"],["class","schedule-row","fxLayout","row","fxLayoutAlign","start",4,"ngFor","ngForOf"],["fxLayout","row","fxLayoutAlign","start",1,"schedule-row"],["fxLayoutAlign","center center","fxLayout","row",1,"schedule-time",3,"click"],[1,"schedule-start"],[1,"schedule-dash"],[1,"schedule-end"],["fxLayoutAlign","center center",1,"class-sign",3,"click"],[1,"signed-user"],["fxLayoutAlign","center center",1,"class-name",3,"click"],["mat-icon-button","",3,"ngClass","click"]],template:function(e,t){1&e&&(r.Tb(0,"div",0),r.Tb(1,"div",1),r.Dc(2,be,2,1,"ng-container",2),r.gc(3,"async"),r.Sb(),r.Tb(4,"div",3),r.Tb(5,"div",4),r.Tb(6,"mat-calendar",5),r.bc("selectedChange",function(e){return t.filterScheduleDates(e)}),r.Sb(),r.Tb(7,"div",6),r.Tb(8,"button",7),r.bc("click",function(){return t.addSchedule()}),r.Tb(9,"mat-icon"),r.Ec(10,"add"),r.Sb(),r.Sb(),r.Sb(),r.Sb(),r.Sb(),r.Sb()),2&e&&(r.Cb(2),r.mc("ngIf",r.hc(3,3,t.schedules$)),r.Cb(4),r.mc("headerComponent",t.scheduleCalendarHeader)("selected",t.scheduleDate))},directives:[m.b,m.a,a.n,m.c,C.d,S.b,H.a,a.m,a.l,T.a],pipes:[a.b,a.f],styles:[".daily-schedule{margin-bottom:30px;padding-bottom:20px;padding-top:20px}.daily-schedule .class-sign{width:120px}.daily-schedule .schedule-row{height:40px;cursor:pointer}.daily-schedule .schedule-row:hover{background-color:rgba(0,117,169,.1)}.daily-schedule .schedule-row:hover .remove-schedule{display:block}.daily-schedule .schedule-row:hover .sign-in-button{visibility:visible}.daily-schedule .schedule-row .remove-schedule{display:none}.daily-schedule .schedule-row .sign-in-button{min-width:150px;visibility:hidden}.daily-schedule .schedule-time{width:200px}.daily-schedule .class-name{width:20%}.daily-schedule .day-of-week{font-size:20px;margin-bottom:10px}.daily-schedule .day-of-week .day{width:40px}.daily-schedule .schedule-date{font-size:18px;align-items:center;display:flex;margin-left:21px}.daily-schedule .highlighted-day{background-color:rgba(0,117,169,.8);color:#fff}#add-schedule-container{margin-bottom:20px}#schedule-datepicker{position:fixed;width:460px;top:75px;height:calc(100% - 80px)}"],encapsulation:2,changeDetection:0}),e})();const fe=[{path:"",component:pe},{path:"schedules",component:pe}];let ye=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=r.Lb({type:e}),e.\u0275inj=r.Kb({imports:[[s.f.forChild(fe)],s.f]}),e})();var Ce=n("PCNd");let Se=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=r.Lb({type:e}),e.\u0275inj=r.Kb({providers:[ae],imports:[[a.c,Ce.a,ye,o.l]]}),e})()}}]);