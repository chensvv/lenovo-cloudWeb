

class EhiI18n {
    languageKey = 'ehiI18n.Language'
    language = 'zh'
    languageJSON = {}
    basePath = ''
    typeReg = /(\[.*\])/g
    valReg = /([^(\[.+\])]+$)|(^[^(\[.+\])]+)/g
    callback = null
    constructor(basePath,callback) {
        if(typeof basePath === 'function'){
            this.callback = basePath
        }else{
            this.basePath = basePath
            this.callback = callback
        }
        // this.setLanguage()
        this.getLanguage()
        this.loadLanguage()
        // console.log(`${this.languageKey} = ${this.language}`)
        this.setCookie(this.languageKey,this.language,7)
        
    }



    /**
     * 初始化界面元素
     * @param languageJSON
     */
    init(languageJSON) {
        let domAll = document.querySelectorAll('[i18n]');
        for (let i = 0; i < domAll.length; i++) {
            let dom = domAll[i]
            let i18n = dom.getAttribute('i18n')
            let result = i18n.match(this.typeReg);
            let types = []
            let attr = ''
            if (result != null && result.length > 0) {
                let type = result[0]
                type = type.substring(1, type.length - 2)
                if (type.indexOf(',') !== -1) {
                    let typeArr = type.split(',')
                    for (let j = 0; j < typeArr.length; j++) {
                        if (typeArr[j].indexOf('.') !== -1) {
                            let typeArrAttr = typeArr[j].split('.')
                            types.push({type: typeArrAttr[0], attr: typeArrAttr[1]})
                        } else {
                            types.push(typeArr[j])
                        }
                    }
                } else {
                    if (type.indexOf('.') !== -1) {
                        let typeArr = type.split('.')
                        types.push({type: typeArr[0], attr: typeArr[1]})
                    } else {
                        types.push(type)
                    }
                }
            } else {
                types.push('html')
            }
            let key = i18n.match(this.valReg);
            key = key[0]
            let text = languageJSON[key]
            for (let j = 0; j < types.length; j++) {
                let type = types[j]
                let attr = ''
                if (typeof types[j] === 'object') {
                    type = types[j]['type']
                    attr = types[j]['attr']
                }
                if ('html' === type) {
                    dom.innerHTML = text
                } else if (type === 'value') {
                    dom.value = text
                } else if (type === 'placeholder') {
                    dom.setAttribute('placeholder', text)
                } else if (type === 'attr') {
                    dom.setAttribute(attr, text)
                }
            }
        }
    }

    /**
     * 获取国际化对应的值
     * @param key
     * @returns {*}
     */
    get(key) {
        return this.languageJSON[key]
    }

    /**
     * 加载语言文件
     */
    loadLanguage() {
        let urltype
        if(window.location.host == 'voice.lenovomm.com'){
            urltype = `https://voice.lenovomm.com/voicePlatform/lan/`
        }else{
            urltype = `${this.basePath}`
        }
        let url = `${urltype}${this.language}.json`
        let request = new XMLHttpRequest()
        request.open("get", url ,true)
        request.send(null)
        request.onload = () => {
            if (request.status === 200) {
                this.languageJSON = JSON.parse(request.responseText)
                this.init(this.languageJSON)
                if(this.callback){
                    this.callback()
                }
            } else {
                console.error(`语言设置读取失败:${JSON.stringify(request)}`)
            }
        }
    }

    /**
     * 获取当前设置的语言
     */
    getLanguage() {
        // console.log(this.getCookie(document.cookie))
        // let languageTemp = localStorage.getItem(`${this.languageKey}`)
        let languageTemp = this.getCookie(document.cookie)
        if (languageTemp != null && languageTemp.length > 0) {
            this.language = languageTemp
        }
        return this.language
    }

    /**
     * 设置当前语言
     * @param language
     */
    
    setLanguage(language) {
        this.language = language
        // localStorage.setItem(`${this.languageKey}`, language)
        this.setCookie(this.languageKey,language,7)
        this.loadLanguage()
    }
    
    /**
     * 获取cookie
     */

    getCookie(s){
        var str = s;
        //将值切割成数组
        var arr = str.split(";");
        var userid;
        //遍历数组
        for(var i=0;i<arr.length;i++){
            var value = arr[i].split("=");
            if(value[0] == 'ehiI18n.Language'){
                userid = value[1];
            }
        }
        return userid
    }

    setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
	}
}
