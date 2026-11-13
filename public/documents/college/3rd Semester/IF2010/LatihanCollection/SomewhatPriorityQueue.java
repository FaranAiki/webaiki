import java.util.*;

public class SomewhatPriorityQueue<T extends Comparable<? super T>> implements Collection<T> {
    private class Node {
        private T data;
        private Node next;
        private Node prev;

        private Node(T data) {
            this.data = data;
        }
    }

    private int size;
    private Node head;
    private Node tail;

    public SomewhatPriorityQueue() {}

    @Override
    public boolean add(T element) {
        if (element == null) return false; 
        
        Node newNode = new Node(element);

        if (isEmpty()) {
            head = tail = newNode;
        } else {
            if (element.compareTo(tail.data) >= 0) {
                tail.next = newNode;
                newNode.prev = tail;
                tail = newNode;
            } 
            else if (element.compareTo(head.data) <= 0) {
                newNode.next = head;
                head.prev = newNode;
                head = newNode;
            } 
            else {
                Node curr = tail;
                while (curr != null && element.compareTo(curr.data) < 0) {
                    curr = curr.prev;
                }
                newNode.next = curr.next;
                newNode.prev = curr;
                curr.next.prev = newNode;
                curr.next = newNode;
            }
        }
        size++;
        return true;
    }

    @Override
    public int size() {
        return this.size;
    }

    @Override
    public boolean isEmpty() {
        return this.size == 0;
    }

    @Override
    public void clear() {
        head = null;
        tail = null;
        size = 0;
    }

    @Override
    public Iterator<T> iterator() {
        return new Iterator<T>() {
            private Node curr = head;

            @Override
            public boolean hasNext() {
                return curr != null;
            }

            @Override
            public T next() {
                if (!hasNext()) throw new NoSuchElementException();
                T data = curr.data;
                curr = curr.next;
                return data;
            }
        };
    }

    @Override
    public boolean contains(Object o) {
        for (T item : this) {
            if (item.equals(o)) return true;
        }
        return false;
    }

    @Override
    public Object[] toArray() {
        Object[] arr = new Object[size];
        int i = 0;
        for (T item : this) arr[i++] = item;
        return arr;
    }

    @Override
    public <E> E[] toArray(E[] a) {
        return null; // males pake reflection 
    }

    @Override
    public boolean remove(Object o) {
        Node curr = head;
        while (curr != null) {
            if (curr.data.equals(o)) {
                if (curr.prev != null) curr.prev.next = curr.next;
                else head = curr.next;

                if (curr.next != null) curr.next.prev = curr.prev;
                else tail = curr.prev;

                size--;
                return true;
            }
            curr = curr.next;
        }
        return false;
    }

    @Override
    public boolean containsAll(Collection<?> c) {
        for (Object e : c) {
            if (!contains(e)) return false;
        }
        return true;
    }

    @Override
    public boolean addAll(Collection<? extends T> c) {
        boolean modified = false;
        for (T e : c) {
            if (add(e)) modified = true;
        }
        return modified;
    }

    @Override
    public boolean removeAll(Collection<?> c) {
        boolean modified = false;
        for (Object e : c) {
            if (remove(e)) modified = true;
        }
        return modified;
    }

    @Override
    public boolean retainAll(Collection<?> c) {
        boolean modified = false;
        Node curr = head;
        while (curr != null) {
            Node nextNode = curr.next;
            if (!c.contains(curr.data)) {
                remove(curr.data);
                modified = true;
            }
            curr = nextNode;
        }
        return modified;
    }

    public T getMaximum() { return tail.data; }
    public T getMinimum() { return head.data; }

    public String toString() {
      StringBuilder sb = new StringBuilder();
      for (T elem: this) {
        sb.append(elem + " ");
      }
      return sb.toString();
    }
}
