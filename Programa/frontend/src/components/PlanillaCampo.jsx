function PlanillaCampo({ etiqueta, valor, columnas = "col-md-6" }) {
    return (
        <div className={`col-12 ${columnas}`}>
            <label className="form-label">{etiqueta}</label>
            <input
                type="text"
                readOnly
                tabIndex={-1}
                className="form-control text-center bg-white pe-none user-select-none"
                value={valor}
            />
        </div>
    );
}

export default PlanillaCampo;