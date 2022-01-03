

const chunk = function(list, size) {
    let chunks = [];
    
    while(this.length) {
        chunks.push(list.splice(0, size));
    }
        
    return chunks;
}