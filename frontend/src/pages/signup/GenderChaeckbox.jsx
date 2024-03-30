const GenderCheckbox = ()=>{
    return <div className="flex">
        <div className="form-control">
            <label className="label gap-2 cursor-pointer">
                <span className="label-text  text-gray-200">Male</span>
                <input type="checkbox" className="checkbox border-slate-300" />
            </label>
        </div>
        <div className="form-control">
            <label className="label gap-2 cursor-pointer">
                <span className="label-text text-gray-200">Female</span>
                <input type="checkbox" className="checkbox border-slate-300" />
            </label>
        </div>
    </div>
}

export default GenderCheckbox;