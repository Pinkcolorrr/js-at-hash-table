import { LinkedList } from 'at-linked-list';

class Bucket {
  key;
  value;

  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

export class HashTable {
  array;

  constructor() {
    this.array = Array(5);
  }

  #getIndex(hash) {
    return hash % this.array.length;
  }

  #getHash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }

    return hash;
  }

  #expandArray() {
    const expandedArray = Array(this.array.length * 2);

    this.array.forEach((item, index) => {
      expandedArray[index] = item;
    });

    this.array = expandedArray;
  }

  set(key, value) {
    if (this.length() === this.array.length) {
      this.#expandArray();
    }

    const hash = this.#getHash(key);
    const index = this.#getIndex(hash);
    const newBucket = new Bucket(key, value);
    const bucket = this.array[index];

    if (!bucket) {
      this.array[index] = newBucket;
      return newBucket;
    }

    if (bucket instanceof LinkedList) {
      const item = bucket.find((i) => i.key === key);

      if (item) {
        bucket.delete(item.value);
      }

      bucket.append(newBucket);
      return newBucket;
    }

    if (bucket.key === newBucket.key) {
      this.array[index] = newBucket;
      return newBucket;
    }

    const newLinkedList = new LinkedList();
    newLinkedList.append(bucket);
    newLinkedList.append(newBucket);
    this.array[index] = newLinkedList;
    return newBucket;
  }

  delete(key) {
    const hash = this.#getHash(key);
    const index = this.#getIndex(hash);
    const bucket = this.array[index];

    if (bucket === undefined || bucket === null) {
      return;
    }

    if (bucket instanceof LinkedList) {
      const deletedItem = bucket.find((item) => (item.key = key))?.value;
      bucket.delete(deletedItem);
      return deletedItem;
    }

    this.array[index] = null;
    return bucket;
  }

  get(key) {
    const hash = this.#getHash(key);
    const index = this.#getIndex(hash);
    const bucket = this.array[index];

    if (bucket instanceof LinkedList) {
      return bucket.find((item) => item.key === key);
    }

    return bucket;
  }

  has(key) {
    return !!this.get(key);
  }

  length() {
    let bucketLength = 0;

    this.array.forEach((item) => {
      if (item instanceof LinkedList) {
        bucketLength += item.length();
      } else {
        bucketLength++;
      }
    });

    return bucketLength;
  }
}

const hashTable = new HashTable();
