// keep the left size sorted and insert intems from the right part in the right posistion 
function insertionSort(arr){
    for(let i=1;i<arr.length;i++){
        let current = arr[i];
        for(var j=i-1; j>-1 && current < arr[j] ;j--){
            arr[j+1] = arr[j];
        }
        arr[j+1] = current;
    }
    return arr;
}

console.log(insertionSort([4,1,3,10,22,4,1]));