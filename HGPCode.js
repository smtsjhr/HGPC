
/** Class representing a HyperGraph Product Code. */
class HGPCode {
     /**
     * Create a HyperGraph Product Code.
     * @param {array} code0 - The first seed code.
     * @param {array} code1 - The second seed code.
     */
    constructor(code0, code1 = undefined) {
        this.code0 = code0
        if (code1 === undefined) {
            this.code1 = code0
        }
        else {
            this.code1 = code1
        }
        this.code0_dual = this.code0.T
        this.code1_dual = this.code1.T

        this.code0_m = this.code0.shape[0]
        this.code0_n = this.code0.shape[1]
        this.code1_m = this.code1.shape[0]
        this.code1_n = this.code1.shape[1]
        this.code0_dual_m = this.code0.shape[1]
        this.code0_dual_n = this.code0.shape[0]
        this.code1_dual_m = this.code1.shape[1]
        this.code1_dual_n = this.code1.shape[0]

        this.sector_L_rows = this.code0_n
        this.sector_L_cols = this.code1_n
        this.sector_R_rows = this.code0_m
        this.sector_R_cols = this.code1_m

        this.SLTform = this.SLTdata_collection()

        this.code0_k = this.SLTform["code0"]["dimension"]
        this.code1_k = this.SLTform["code1"]["dimension"]
        this.code0_dual_k = this.SLTform["code0_dual"]["dimension"]
        this.code1_dual_k = this.SLTform["code1_dual"]["dimension"]

        this.code0_d = HGPCode.distance(this.SLTform["code0"]["kernal_basis"])
        this.code1_d = HGPCode.distance(this.SLTform["code1"]["kernal_basis"])
        this.code0_dual_d = HGPCode.distance(this.SLTform["code0_dual"]["kernal_basis"])
        this.code1_dual_d = HGPCode.distance(this.SLTform["code1_dual"]["kernal_basis"])

        this.n = this.code0_n*this.code1_n + this.code0_m*this.code1_m
        this.k = this.code0_k*this.code1_k + this.code0_dual_k*this.code1_dual_k
        this.d = Math.min(this.code0_d, this.code1_d, this.code0_dual_d, this.code0_dual_d)
        
    }

    static SLTdata(array) {
        let m = array.shape[0]
        let n = array.shape[1]
        let H = array.clone()
        let K = nj.identity(n)
        let pivots = Array.from(Array(n), (_, index) => index + 1);
        
        for(let j = 1; j <= n; j++) {
            let i = 1
            while(H.get(i-1, j-1) != 1 && i <= m ) {
                i = i + 1
            }
            if(H.get(i-1, j-1) == 1) {
                pivots.splice(pivots.indexOf(j),1)
                for(let l = j + 1; l <= n; l++) {
                    if(H.get(i-1, l-1) == 1) {
                        for(let row = 0; row < m; row++) {
                            H.set(row, l-1, (H.get(row, j-1) + H.get(row, l-1))%2)
                            K.set(row, l-1, (K.get(row, j-1) + K.get(row, l-1))%2)
                        }
                    }
                }
            }
        }
    
        let kernal_basis = []
        pivots.forEach(col => kernal_basis.push(K.T.tolist()[col-1]))
        let kernal_array = nj.array(kernal_basis).T
    
        let dual_comp_basis = []
        pivots.forEach(col => dual_comp_basis.push(nj.identity(n).tolist()[col-1]))
        let dual_comp_array = nj.array(dual_comp_basis).T
    
        let data = {
            "pivots" : pivots,
            "dimension": pivots.length,
            "kernal_basis": kernal_basis,
            "kernal_array": kernal_array,
            "dual_comp_basis": dual_comp_basis,
            "dual_comp_array": dual_comp_array,
         }
    
        return data
    }

    SLTdata_collection() {
        let data = {
            "code0": HGPCode.SLTdata(this.code0),
            "code0_dual": HGPCode.SLTdata(this.code0_dual),
            "code1": HGPCode.SLTdata(this.code1),
            "code1_dual": HGPCode.SLTdata(this.code1_dual)
        }

        return data
    }

    stab_X(i, j) {
        let XL = nj.dot(this.code0_dual, HGPCode.E(this.code0_m, this.code1_n, i,j))
        let XR = nj.dot(HGPCode.E(this.code0_m, this.code1_n, i,j), this.code1_dual)
        return [XL,XR]
    }

    stab_Z(i, j) {
        let ZL = nj.dot(HGPCode.E(this.code0_n, this.code1_m, i,j), this.code1)
        let ZR = nj.dot(this.code0, HGPCode.E(this.code0_n,this.code1_m, i,j))
        return [ZL,ZR]
      }

    construct_logicals(A_basis, B_basis) {
        let list = []
        for(let i = 0; i < A_basis.length; i++) {
            for(let j = 0; j < B_basis.length; j++) {
                let v = A_basis[i]
                let w = B_basis[j]
                let L = HGPCode.reshape(v, w)
                list.push(L)
            }
        }

        return list
    }

    logical_Z_L() {
        let A_basis = this.SLTform["code0"]["kernal_basis"]
        let B_basis = this.SLTform["code1"]["dual_comp_basis"]

        return this.construct_logicals(A_basis, B_basis)
    }
    
    logical_Z_R() {
        let A_basis = this.SLTform["code0_dual"]["dual_comp_basis"]
        let B_basis = this.SLTform["code1_dual"]["kernal_basis"]

        return this.construct_logicals(A_basis, B_basis)
    }

    logical_X_L() {
        let A_basis = this.SLTform["code0"]["dual_comp_basis"]
        let B_basis = this.SLTform["code1"]["kernal_basis"]

        return this.construct_logicals(A_basis, B_basis)
    }

    logical_X_R() {
        let A_basis = this.SLTform["code0_dual"]["kernal_basis"]
        let B_basis = this.SLTform["code1_dual"]["dual_comp_basis"]

        return this.construct_logicals(A_basis, B_basis)
    }

    logical_index() {
        let dict = {"L" : [], "R" : []}
        let pivots0 = this.SLTform["code0"]["pivots"]
        let pivots1 = this.SLTform["code1"]["pivots"]
        for(let i = 0; i < pivots0.length; i ++) {
            for(let j = 0; j < pivots1.length; j++) {
                dict["L"].push([pivots0[i], pivots1[j]])
            }
        }

        let pivots0_dual = this.SLTform["code0_dual"]["pivots"]
        let pivots1_dual = this.SLTform["code1_dual"]["pivots"]
        for(let i = 0; i < pivots0_dual.length; i ++) {
            for(let j = 0; j < pivots1_dual.length; j++) {
                dict["R"].push([pivots0_dual[i], pivots1_dual[j]])
            }
        }
        
        return dict
    }

    logical_index_array() {
        let logical_index_dict = this.logical_index()
        let L_array = nj.zeros([this.sector_L_rows, this.sector_L_cols])
        let R_array = nj.zeros([this.sector_R_rows, this.sector_R_cols])
        logical_index_dict["L"].forEach(index_pair => L_array.set(index_pair[0] - 1, index_pair[1] - 1, 1))
        logical_index_dict["R"].forEach(index_pair => R_array.set(index_pair[0] - 1, index_pair[1] - 1, 1))
        let dict = {"L" : L_array, "R" : R_array}
        return dict
    }

    static distance(basis) {
        let bit_length = basis.length
        let n = basis[0].length
        let min_weight = n
        for (let i = 1; i < Math.pow(2,bit_length); i++) {
            let num = i
            let bitstring = num.toString(2)
            let codeword = nj.zeros([n,1]).T;
            for (let k = 0; k < basis.length; k++) {
                if (bitstring[k] == '1') {
                    codeword = nj.mod(nj.add(codeword, nj.array([basis[k]])), 2)
                }
            }
            let current_weight = HGPCode.weight(codeword)
            if (current_weight < min_weight) {
                min_weight = current_weight
            }
        }
        return min_weight
    }

    static weight(array) {
        if (array instanceof nj.NdArray) {
            return nj.sum(array)
        }
        else if (array instanceof Array ) {
            let njarray;
            if (array[0][0] !== undefined) {
                njarray = nj.array([array])
            }
            else {
                njarray = nj.array(array)
            }
            return nj.sum(njarray)
        }
    }

    static reshape(v, w) {
        let v_array = nj.array([v]).T
        let w_array = nj.array([w])
    
        return HGPCode.tensor(v_array, w_array)
    }
    
    static E(m,n,i,j) {
        let z = nj.zeros([m, n])
        z.set(i-1,j-1,1)
        return z
    }
    
    static tensor(A, B) {
        const A_rows = A.shape[0]
        const A_cols = A.shape[1]
        const B_rows = B.shape[0]
        const B_cols = B.shape[1]
    
        let Z = nj.zeros([A_rows*B_rows, A_cols*B_cols])
        for(let colA = 0; colA < A_cols; colA++) {
            for(let rowA = 0; rowA < A_rows; rowA++) {
                for(let colB = 0; colB < B_cols; colB++) {
                    for(let rowB = 0; rowB < B_rows; rowB++) {
                        Z.set(rowB + rowA*B_rows, colB + colA*B_cols, A.get(rowA, colA) * B.get(rowB, colB))
                    }
                }
            }  
        }
    
        return Z
    }

}

