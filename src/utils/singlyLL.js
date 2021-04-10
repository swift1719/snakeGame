export class LinkedListNode{
    constructor(value){
        this.value=value;//value :{row: , col: ,cell: }
        this.next=null;
    }
}
export class SinglyLinkedList{
    constructor(value){
        const node=new LinkedListNode(value);
        this.head=node;
        this.tail=node;
    }
}
export function reverseLinkedList(head){
    let previousNode=null;
    let currentNode=head;
    while(currentNode!==null){
        const nextNode=currentNode.next;
        currentNode.next=previousNode;
        previousNode=currentNode;
        currentNode=nextNode;
    }
    return previousNode;
}