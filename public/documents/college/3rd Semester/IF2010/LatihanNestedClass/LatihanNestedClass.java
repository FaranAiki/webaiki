class OuterShape {
    private String shapeName = "Outer Shape";
    private static String className = "OuterShape";
    
    private void printHello() {
        System.out.println("hello from outer class");
    }

    // Static nested class StaticPoint
    // ^ TIDAK BISA, karena className itu kan terikat pada OuterShape
    // Kecuali kalau static String shapeName atau static String className
    public /*static*/ class StaticPoint {
        private double x;
        private double y;
        public StaticPoint(double x, double y) {
            this.x = x;
            this.y = y;
        }

        public void displayInfo() {
            System.out.println("Class Name: " + className); // can we do this? Yes!
            System.out.println("Shape Name: " + shapeName); // what about this? Yes!
            printHello(); // tiap private bisa diakses dalam nested class
        }
    }
}

// Non-static inner class - can access all members of outer class
class InnerRectangle {
    private Size size;
    private static String shapeName = "Tes shape";

    public InnerRectangle(double width, double height) {
        this.size = new Size(width, height);
    }

    public class Size {
        public double width;
        public double height;

        public Size(double width, double height) {
            this.width = width;
            this.height = height;
        }
    }

    public void displayInfo() {
        System.out.println("Shape Name: " + shapeName);  // Access private field
        System.out.println("Width: " + size.width);
        System.out.println("Height: " + size.height);
    }

    public void updateShapeName(String name) {
        shapeName = name;
    }
}

class Class1 {
    protected InnerClass1 ic;

    public Class1() {
        ic = new InnerClass1();
    }

    public void displayStrings() {
        System.out.println(ic.getString() + ".");
        System.out.println(ic.getAnotherString() + ".");
    }

    protected class InnerClass1 {
        public String getString() {
            return "InnerClass1: getString invoked";
        }

        public String getAnotherString() {
            return "InnerClass1: getAnotherString invoked";
        }
    }
}

public class LatihanNestedClass {
    public static void main(String args[]) {
        OuterShape os = new OuterShape();
        OuterShape.StaticPoint smthg = os.new StaticPoint(1, 2);
        smthg.displayInfo();

        InnerRectangle ir = new InnerRectangle(1, 2);
        ir.displayInfo();

        Class1 aku = new Class1();
        aku.displayStrings();

        Class1.InnerClass1 inaku = aku.new InnerClass1();
        System.out.println("akhir: " + inaku.getString());
        System.out.println("akhir: " + inaku.getAnotherString());
    }
}
