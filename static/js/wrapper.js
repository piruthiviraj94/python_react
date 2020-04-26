class Dropdown extends React.Component {
    constructor(props) {
        super();
        this.state = { };
    }    
   render() {
       return (
           <div>
            <select id={this.props.id} onChange={this.props.handlechange}>
                        <option>--select--</option>
                        {this.props.names.map((d,i)=>{
                            if(this.props.selected==d){
                               return  <option value={d} selected>{d}</option> 

                            }else{
                        
                                return <option value={d} >{d}</option> 
                            }
                        }
                         )}
            </select>
        </div>
     )}
}
class Wrapper extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        name:"",shop_name:"",status:"",id:0,btn:false,selected:5,
        res_status:"",data:[],edit:false,err_status:null,options:[]
    };
     this.handleclick=this.handleclick.bind(this);
     this.handleData=this.handleData.bind(this);
    }
    componentDidMount(){
        this.getDetails()
        var lst=[]
        for(var i=1;i<=20;i++){
            lst.push(i)
        }
        console.log("lst:",lst)
        this.setState({options:lst})
    }
    getDetails(){
        var temp=this;
        const request = async () => {
            var url = '/get_details';
            const response = await fetch(url, {method:'GET', headers: {'Content-Type': 'application/json'}});
            const data = await response.json();
            console.log("data:",data.data)
            var resdat=data.data.data
            if(resdat.length>0){
                temp.setState({data:resdat})
            }else{
                temp.setState({data:resdat})
            }
        }
        request()
    }
    handleData(e){
        console.log("e.target.id",e.target.id)
        if(e.target.id.includes("edit")==true){
            var id=Number(e.target.id.split("_")[1]);
            var data=this.state.data.filter(d=>{
                // console.log(d.id==id,d.id,id)
                if(Number(d.id)==id){
                    return d
                }
            });
            console.log("edit data filtered:",data)
            
            this.setState({edit:true,edit_data:data,name:data[0].name,shop_name:data[0].shop_name,status:data[0].status})
        }else if(e.target.id.includes("delete")==true){
            var id=Number(e.target.id.split("_")[1]);
            var temp=this;
            console.log("obj",obj)
            const request = async () => {
                var url = '/delete_details';
                const response = await fetch(url, {method:'DELETE', headers: {'Content-Type': 'application/json'}
                ,body:JSON.stringify({id:id})});
                const data = await response.json();
                console.log("delete res:",data)
                if(data.data=="ok"){
                    this.getDetails()
                    temp.setState({res_status:"Deleted successfully!",edit:false, name:"",shop_name:"",status:""})
                }else{
                    temp.setState({err_status:"Someting went Wrong"})
                }
            }
            request()
        }
        else if(e.target.id=="save"){
            console.log("this.state.edit_data:",this.state.edit_data)
            var temp=this;
            var obj={
                "id":this.state.edit_data[0].id,
                "name":this.state.name,
                "shop_name":this.state.shop_name,
                "status":this.state.status,
                "date":this.state.edit_data[0].date
            }
            console.log("obj",obj)
            const request = async () => {
                var url = '/update_details';
                const response = await fetch(url, {method:'PUT', headers: {'Content-Type': 'application/json'}
                ,body:JSON.stringify(obj)});
                const data = await response.json();
                console.log("sava res:",data)
                if(data.data=="ok"){
                    this.getDetails()
                    temp.setState({res_status:"updated successfully!",edit:false, name:"",shop_name:"",status:""})
                }else{
                    temp.setState({err_status:"Someting went Wrong"})
                }
            }
            request()
        }

    }
    handleclick(e){
        console.log("e.target.id",e.target.id)
        console.log("e.target.value",e.target.value)
        if(e.target.id=="uname"){
            this.setState({name:e.target.value,err_status:null})
        }else if(e.target.id=="shop_name"){
            this.setState({shop_name:e.target.value,err_status:null})
        }else if(e.target.id=="status"){
            this.setState({status:e.target.value,err_status:null})
        }else if(e.target.id=="btn"){
            var temp=this;
            const request = async () => {
                var url = '/store_details';
                const response = await fetch(url, {method:'POST', headers: {'Content-Type': 'application/json'}
                ,body:JSON.stringify({name:this.state.name,shop_name:this.state.shop_name,status:this.state.status})});
                const data = await response.json();
                console.log("data:",data.data)
                if(data.data=="ok"){
                    temp.setState({res_status:"stored successfully!", name:"",shop_name:"",status:""})
                    this.getDetails()

                }else{
                    temp.setState({err_status:"Someting went Wrong"})
                }
            }
            if(this.state.name.length>0 || this.state.shop_name.length>0 ||this.state.status.length>0){
                request()
            }else{
                temp.setState({err_status:"Fields are empty"})
            }
        }
        else if(e.target.id =="selectopt"){
            this.setState({selected:e.target.value})
            this.generateTable(this.state.data)
        }
    }
    generateTable(data){
        console.log("tabledata:",data)
        var resdat=[]
        if(data.length>0){
            resdat=data.map((i,j)=>{
                if((j+1)<=this.state.selected){
                    return(
                        <tr className="result-row" align="center">
                            <td className="cell-02">{i.name}</td>
                            <td className="cell-02">{i.shop_name}</td>
                            <td className="cell-02">{i.date}</td>
                            <td className="cell-02"><button id={"edit_"+i.id} onClick={this.handleData}>EDIT</button></td>
                            <td className="cell-02"><button id={"delete_"+i.id} onClick={this.handleData}>DELETE</button></td>
                        </tr>
                    )
                }

            })
        }else{
            resdat=[1].map(i=>{
                return(
                <tr className="result-row" align="center">
                <td className="cell-02">{}</td>
                <td className="cell-02">{}</td>
                <td className="cell-02">{}</td>
                <td className="cell-02"></td>
                <td className="cell-02"></td>
            </tr>)})
        }
        return resdat

    }
    
    dropdown(data,id,values){
        return(
            <select id={id} onChange={this.handleClick} >
                {data.map((d,i)=>{
                        if(selectopt != null){
                            return <option key={i} id={i} value={values[i]}>{d}</option> 
                        }

                    })
                }
            </select>
        )
    }
    editDetails(data){
        return(
            <div className="mobile-section">
                
                            <div className="mobile-username">
                                <p>NAME</p>
                                <input id="uname" className="" type="text" value={this.state.name} name="uname" onChange={this.handleclick} placeholder="Ex: Abc" required/>
                            </div>
        
                            <div className="mobile-username">
                                <p>SHOP NAME</p>
                                <input id="shop_name" className="" type="text" value={this.state.shop_name} name="shop_name"  onChange={this.handleclick} placeholder="Ex: textiles" required/>
                            </div>
                            <div className="mobile-username">
                                <p>STATUS</p>
                                {/* <textarea id="status"  onChange={this.handleclick}  rows="4" cols="29">
                                {this.state.status}
                                </textarea> */}
                                <input id="status" className="status" type="text" value={this.state.status} name="status"  onChange={this.handleclick} placeholder="Ex: textiles" required/>

                            </div>
                            {this.state.err_status==null?
                            <button id="save"  onClick={this.handleData} className="loginbutton" >SAVE</button>
                            :<p className="err-text">{this.state.err_status}</p>}
        
                        </div>
        )

    }
    render(){
      return (
        <div className="main-content">
            
            <div className="right-content">
                <div className="right-section">
                    <div className="right-bar-heading">
                        <div className="eighty-section">
                        </div>
                    </div>

                    <div className="right-workarea">
                        <div className="sectionD">
                            {this.state.data.length>0?
                            <div>
                            <table className="sectiontable">
                                <tr className="result-row">
                                <th className="cell-02">Name</th>
                                <th className="cell-02">Status</th>
                                <th className="cell-02">Date</th>
                                <th className="cell-02">Edit</th>
                                <th className="cell-02">Delete</th>
                                </tr>
                                {this.generateTable(this.state.data)}

                            </table>
                            {/* {this.dropdown(this.state.options,"selectopt",this.state.options)} */}
                            <div className="dropdown" ><Dropdown id={"selectopt"}  selected={this.state.selected}  names={this.state.options} handlechange={this.handleclick} /></div>
                            </div>
                            :
                            <div>
                            <table className="sectiontable">
                                <tr className="result-row">
                                <th className="cell-02">Name</th>
                                <th className="cell-02">Status</th>
                                <th className="cell-02">Date</th>
                                <th className="cell-02">Edit</th>
                                <th className="cell-02">Delete</th>
                                </tr>
                                
                                <tr className="result-row" align="center">
                                    <td className="cell-02">{}</td>
                                    <td className="cell-02">{}</td>
                                    <td className="cell-02">{}</td>
                                    <td className="cell-02"></td>
                                    <td className="cell-02"></td>
                                </tr>
                            </table>
                            {/* {this.dropdown(this.state.options,"selectopt",this.state.options)} */}
                            <div className="dropdown" ><Dropdown id={"selectopt"} selected={this.state.selected} names={this.state.options} handlechange={this.handleclick} /></div>

                            </div>
                            
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="left-content">
                <div className="left-content-bar-heading">
                    <div className="hundred-section">
                        <div className="left-content-header-section">
                            <div className="left-content-header-text">DETAILS</div>
                        </div>
                    </div>
                </div>
                {this.state.edit!=true?
                                <div className="mobile-section">
                
                                <div className="mobile-username">
                                    <p>NAME</p>
                                    <input id="uname" className="" type="text" value={this.state.name} name="uname" onChange={this.handleclick} placeholder="Ex: Abc" required/>
                                </div>
            
                                <div className="mobile-username">
                                    <p>SHOP NAME</p>
                                    <input id="shop_name" className="" type="text" value={this.state.shop_name} name="shop_name"  onChange={this.handleclick} placeholder="Ex: textiles" required/>
                                </div>
                                <div className="mobile-username">
                                    <p>STATUS</p>
                                    <input id="status" className="status" type="text" value={this.state.status} name="status"  onChange={this.handleclick} placeholder="Ex: textiles" required/>

                                    {/* <textarea id="status"  onChange={this.handleclick}  rows="4" cols="29">
                                    {this.state.status}
                                    </textarea> */}
                                </div>
                                {this.state.err_status==null?
            
                                <button id="btn"  onClick={this.handleclick} className="loginbutton" >SUBMIT</button>
                                :<p className="err-text">{this.state.err_status}</p>}
            
                            </div>
                            :
                            this.editDetails(this.state.edit_data)
                            }

            </div>

        </div>
        );
           
    }
}

ReactDOM.render(
    <Wrapper/>,
    document.getElementsByClassName("container")[0]
);
