angular.module("starter").run(["$templateCache", function($templateCache) {$templateCache.put("./templates/editState.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=Состојба content=\"\" scroll=false><ion-content class=has-header style=padding-top:10px; content=\"\" scroll=true><div style=\"margin-left: 10%;margin-top: 20px;margin-bottom: 20px;color: red;margin-right: 10%;\" ng-if=\"vm.HasBeenUpdatedLocally == 1\"><p>Внимание, за ова броило имате внесено податок за овој месец.</p></div><div class=\"row row-center\" style=\"width:80%;margin-left: 10%; margin-right: 10%;\"><div class=col><ion-item class=item-stable style=max-height:70%><div class=rowFull><b>Име/назив</b> :{{vm.imeNaziv}}</div><div class=rowFull><b>Броило</b>: {{vm.broilo}}</div><div class=rowFull><b>Стара состојба</b>: {{vm.state.before}}<ion-checkbox ng-model=vm.newCounter class=new-counter-checkbox></ion-checkbox></div></ion-item></div></div><div class=\"row row-center\"><div class=col><div class=list><div class=\"item item-input inputElement\" ng-show=vm.newCounter><input ng-model=vm.brShasija type=text placeholder=\"Број на шасија\"></div><div class=\"item item-input inputElement\"><input ng-model=vm.state.new type=number min=1 placeholder=\"Нова состојба\" required=\"\"></div><input type=hidden ng-model=vm.state.slika><div style=\"margin-left: 10%; color:red\"><p>{{vm.errors.required}}</p></div><button class=\"button icon-right ion-camera\" style=\"width: 80%;text-align: center;margin-left: 10%;margin-bottom:20px;\" ng-click=vm.takePhoto()>Направи фотографија</button> <button class=\"button icon-right ion-image\" style=\"width: 80%;text-align: center;margin-left: 10%;\" ng-click=vm.choosePhoto()>Прикачи фотографија</button><p>{{errorMessage}}</p></div></div></div><div class=\"row row-center\" ng-if=\"vm.state.slika !== undefined&&vm.state.slika!=null\"><div class=\"col col-75\"><div class=list><div class=\"item item-thumbnail-left\" href=# style=margin-left:13.25%><img ng-show=\"vm.state.slika !== undefined\" ng-src={{vm.state.slika}}><h2>{{vm.state.mesec}}</h2></div></div></div><div class=\"col col-25\"><div class=list><button class=\"button button-positive\" ng-click=vm.removImage()><i class=\"icon ion-android-close\"></i></button></div></div></div><div class=\"row row-center\"><div class=col><div class=list><button class=\"submitButton button button-balanced\" ng-click=vm.saveNewState()><!--ui-sref=\"main.results\">-->ВНЕСИ</button></div></div></div></ion-content></ion-view>");
$templateCache.put("./templates/getarea.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=Реони overflow-scroll=false><ion-content class=has-header style=padding-top:20%; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><select name=selectArea id=selectArea ng-model=vm.data.selectArea class=\"form-control incheck\"><option value=\"\">Реон...</option><!--not selected / blank option--><option ng-repeat=\"option in vm.data.items\" value={{option.reonID}}>{{option.reonID}} - {{option.zabeleska}}</option></select><br></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.downloadReonData() ng-enabled=vm.hasReonsList>Преземи податоци</button></div><div class=row><button class=\"submitButton button button-energized\" ng-click=vm.synchronize()>Синхронизирај</button></div><div class=row><div style=\"margin-left: 10%; margin-top:20px;color:red\"><p>{{vm.errors.required}}</p></div></div></ion-content></ion-view>");
$templateCache.put("./templates/internetConnection.html","<ion-view view-title=\"\" class=hs-view-internetConnection><ion-content scroll=false class=white-bg><div class=card><div class=\"item item-text-wrap\">{{vm.message}}</div></div></ion-content></ion-view>");
$templateCache.put("./templates/login.html","<ion-view class=\"hs-view-home has-header bar-calm\" view-title=Логин content=\"\" scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\"><div class=col><div class=list><label class=\"item item-input inputElement\"><input type=text ng-model=vm.user.username placeholder=\"Корисничко Име\"></label> <label class=\"item item-input inputElement\"><input type=password ng-model=vm.user.password placeholder=Лозинка></label><div style=\"margin-left: 10%; color: red\"><p>{{vm.errors.required}}</p></div></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.login()>ЛОГИРАЈ СЕ</button></div></ion-content></ion-view>");
$templateCache.put("./templates/menu.html","<ion-side-menus enable-menu-with-back-views=false><ion-side-menu-content><ion-nav-bar align-title=center class=\"bar-calm bar-header-with-logo never-hide-inline\"><ion-nav-back-button class=button-clear><i class=ion-android-arrow-back ng-if=\"mainVm.checkArea() && !mainVm.check()\"></i></ion-nav-back-button><ion-nav-title ng-click=\"mainVm.navigateToState(\'main.login\',{})\"><div class=page-title></div></ion-nav-title><ion-nav-buttons side=left><!--<button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\" ng-if=\"!mainVm.check()\"></button>--><button class=\"button icon ion-log-out\" ng-click=mainVm.logOut() ng-if=!mainVm.checkArea()></button></ion-nav-buttons><ion-nav-buttons side=right><button class=\"button icon ion-home\" ng-click=mainVm.area() ng-if=!mainVm.check()></button> <button class=\"button icon ion-search\" ng-click=mainVm.search() ng-if=!mainVm.check()></button></ion-nav-buttons></ion-nav-bar><ion-nav-view name=subview></ion-nav-view></ion-side-menu-content></ion-side-menus>");
$templateCache.put("./templates/results.html","<ion-view class=\"hs-view-home has-header\" view-title=Резултати overflow-scroll=true><ion-content scroll=true padding=false><ion-list ng-repeat=\"item in vm.items\"><ion-item class=item-stable><div class=rowFull><div class=\"colFull col-75\" ng-click=vm.openDetails(item)><div class=row><p class=nameheader>{{item.Naziv}}</p></div><div class=row ng-if=item.ulica><p class=nameheader>{{item.Ulica}} / {{item.Broj}}</p></div></div><div class=\"colFull col-25\" ng-click=vm.openDetails(item)><div class=row>{{item.Broilo}}</div><div class=row>{{item.NovaSostojba}}</div></div></div></ion-item></ion-list><div ng-if=!vm.items.length><div class=\"row row-center\"><h3>* Нема резултати</h3></div></div></ion-content></ion-view>");
$templateCache.put("./templates/search.html","<ion-view class=\"hs-view-home has-header bar-calm\" title=Пребарување overflow-scroll=false><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=false><div class=\"row row-center\" style=max-height:70%;><div class=col><div class=list><div class=\"item item-input inputElement\"><input ng-model=vm.search.imeprezime type=text placeholder=\"Корисник (Име/Презиме)\"></div><div class=\"item item-input inputElement\"><input ng-model=vm.search.lokacija type=text placeholder=\"Локација (Улица, Број ...)\"></div></div></div></div><div class=row><button class=\"submitButton button button-calm\" ng-click=vm.search()>БАРАЈ</button></div><div class=row><div style=\"margin-left: 10%;color:red\"><p>{{vm.errors.required}}</p></div></div></ion-content></ion-view>");
$templateCache.put("./templates/userDetails.html","<ion-view class=\"hs-view-home has-header\" view-title=Корисник overflow-scroll=true><ion-content class=has-header style=padding-top:30px; content=\"\" scroll=true><div class=\"row row-center\" style=max-height:70%;><div class=col><ion-item class=item-stable style=max-height:70%><div class=rowFull><b>Тип на Корисник</b>: {{vm.tipNaKorisnik}}</div><div class=rowFull><b>Шифра на корисник</b>: {{vm.shifraNaKorisnik}}</div><div class=rowFull><b>Име/назив</b> :{{vm.imeNaziv}}</div><div class=rowFull><b>Улица</b>: {{vm.adresa}}</div><div class=rowFull><b>Куќен број</b>: {{vm.kukenBroj}}</div><div class=rowFull><b>Влез</b>: {{vm.vlez}}</div><div class=rowFull><b>Стан</b>: {{vm.stan}}</div><!--<div class=\"rowFull\">\r\n <b>Град</b>: {{vm.grad}}\r\n </div>--></ion-item></div></div><ion-list><ion-item ng-class=vm.getItemClass(item) ng-repeat=\"item in vm.items\"><div class=rowFull><div class=\"colFull col-75\" ng-click=vm.navigateToUserDetails(item)><div class=row><p class=nameheader>{{item.Naziv}}</p></div><div class=row ng-if=item.ulica><p class=nameheader>{{item.Ulica}} / {{item.Broj}}</p></div></div><div class=\"colFull col-25\" ng-click=vm.navigateToUserDetails(item)><div class=row>{{item.Broilo}}</div><div class=row>{{item.NovaSostojba}}</div></div></div></ion-item></ion-list><div class=row><button class=\"submitButton button button-calm\" ui-sref=\"main.editstate({vidkorid: vm.vidkorID, lokacijaID: vm.lokacijaID, korisnikID: vm.korisnikID, reonID: vm.reonID, broilo: vm.broilo, selectedRegion: vm.reonID})\">Внеси нова состојба</button></div></ion-content></ion-view>");}]);