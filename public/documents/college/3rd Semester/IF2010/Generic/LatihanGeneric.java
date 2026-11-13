import java.lang.Class;

enum FromWhere {
  Addition, Subtraction, Multiplication;
}

class Boxed<U extends Number> {
  U data; 
  
  public Boxed(U data) {
    this.data = data;
  }
  
  public void set(U data) {
    this.data = data;
  }
  
  public U get() {
    return this.data;
  }

  public java.lang.Class getUnboxedClass() {
    if (data == null) return null;
    return this.get().getClass();
  }

  public void display() {
    System.out.println(String.format("[Boxed by: %s] (real: %s) %s", this.getClass(), this.getUnboxedClass(), this.get()));
  }
}

class SpecialBoxed<U extends Number> extends Boxed<U> {
  FromWhere from_where;
  public SpecialBoxed(U data, FromWhere from_where) {
      super(data);
      this.from_where = from_where;
  }

  public FromWhere getFromWhere() {
    return this.from_where;
  }

  @Override
  public void display() {
    System.out.println(String.format("[Boxed by: %s] (real: %s) %s (by: %s)", this.getClass(), this.getUnboxedClass(), this.get(), from_where));
  }

  public boolean isCommutative() {
    switch (from_where) {
        case Addition:
        case Multiplication: return true;
        default: return false;
    }
  }
}

class Binary {
  public static<U extends Boxed, V extends Boxed> Class<? extends Number> higherClass(U a1, V a2) {
    Class<?> class1 = a1.getUnboxedClass();
    Class<?> class2 = a2.getUnboxedClass();

    if (class1 == Double.class || class2 == Double.class) return Double.class;
    if (class1 == Float.class || class2 == Float.class) return Float.class;
    if (class1 == Long.class || class2 == Long.class) return Long.class;
    return Integer.class;
  }

  public static<U extends Boxed, V extends Boxed> SpecialBoxed add(U a1, V a2) {
    if (higherClass(a1, a2) == Double.class)   
        return new SpecialBoxed<Double>(a1.get().doubleValue() + a2.get().doubleValue(), FromWhere.Addition); 
    if (higherClass(a1, a2) == Float.class)   
        return new SpecialBoxed<Float>(a1.get().floatValue() + a2.get().floatValue(), FromWhere.Addition);
    if (higherClass(a1, a2) == Long.class)   
        return new SpecialBoxed<Long>(a1.get().longValue() + a2.get().longValue(), FromWhere.Addition);
    return new SpecialBoxed<Integer>(a1.get().intValue() + a2.get().intValue(), FromWhere.Addition);
  }

  public static<U extends Boxed, V extends Boxed> SpecialBoxed subtract(U a1, V a2) {
    if (higherClass(a1, a2) == Double.class)   
        return new SpecialBoxed<Double>(a1.get().doubleValue() - a2.get().doubleValue(), FromWhere.Subtraction); 
    if (higherClass(a1, a2) == Float.class)   
        return new SpecialBoxed<Float>(a1.get().floatValue() - a2.get().floatValue(), FromWhere.Subtraction);
    if (higherClass(a1, a2) == Long.class)   
        return new SpecialBoxed<Long>(a1.get().longValue() - a2.get().longValue(), FromWhere.Subtraction);
    return new SpecialBoxed<Integer>(a1.get().intValue() - a2.get().intValue(), FromWhere.Subtraction);
  }

  public static<U extends Boxed, V extends Boxed> SpecialBoxed multiply(U a1, V a2) {
    if (higherClass(a1, a2) == Double.class)   
        return new SpecialBoxed<Double>(a1.get().doubleValue() * a2.get().doubleValue(), FromWhere.Multiplication); 
    if (higherClass(a1, a2) == Float.class)   
        return new SpecialBoxed<Float>(a1.get().floatValue() * a2.get().floatValue(), FromWhere.Multiplication);
    if (higherClass(a1, a2) == Long.class)   
        return new SpecialBoxed<Long>(a1.get().longValue() * a2.get().longValue(), FromWhere.Multiplication);
    return new SpecialBoxed<Integer>(a1.get().intValue() * a2.get().intValue(), FromWhere.Multiplication);
  }
}

public class LatihanGeneric {
    public static void main(String[] args) {
        Boxed<Integer> a = new Boxed<Integer>(1);
        Boxed<Float> b = new Boxed<Float>(2.0f);
        a.display();
        b.display();
        System.out.println(Binary.higherClass(a, b));
        Binary.add(a, b).display();
        System.out.println("Apakah itu komutatif: " + Binary.add(a, b).isCommutative());
        Binary.subtract(a, b).display();
        System.out.println("Apakah itu komutatif: " + Binary.subtract(a, b).isCommutative());
        Binary.multiply(a, b).display();
        System.out.println("Apakah itu komutatif: " + Binary.multiply(a, b).isCommutative());
    }
}
