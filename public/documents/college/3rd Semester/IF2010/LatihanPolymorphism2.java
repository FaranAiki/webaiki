/* mau coba pake standard library biar latihan juga */
import java.util.List;
import java.util.ArrayList;

public class LatihanPolymorphism2 {
    public static void main(String[] args) { 
        List<Bicycle> daftarSepeda = new ArrayList<>();
        
        daftarSepeda.add(new Bicycle(20, 10, 1));
        daftarSepeda.add(new MountainBike(20, 10, 5, "Dual"));
        daftarSepeda.add(new RoadBike(40, 20, 8, 23));
        daftarSepeda.add(new MountainBike(40, 20, 8, "Trial"));

        System.out.println("**Memulai Test Sepeda**");
        
        // print bicycle 
        for (Bicycle bike : daftarSepeda) {
            bike.printDescription();
        }

        System.out.println("\n**Mengamati Tipe Asli Objek (instanceof)**");
        for (Bicycle bike : daftarSepeda) {
            if (bike instanceof MountainBike) {
                System.out.println("Objek MountainBike!");
                MountainBike mb = (MountainBike) bike; 
                System.out.println("dengan suspensinya adalah " + mb.getSuspension());
            } else if (bike instanceof RoadBike) {
                System.out.println("Objek RoadBike!");
                RoadBike rb = (RoadBike) bike; 
                System.out.println("Lebar bannya adalah " + rb.getTireWidth() + " mm");
            } else {
                System.out.println("Cuman objek Bicycle biasa.");
            }
        }
    }
}

interface Printable {
    void printDescription();
}

class Bicycle implements Printable {
    private int cadence;
    private int speed;
    private int gear;

    public Bicycle(int startCadence, int startSpeed, int startGear) {
        this.cadence = startCadence;
        this.speed = startSpeed;
        this.gear = startGear;
    }

    public int getCadence() { return cadence; }
    public void setCadence(int newValue) { cadence = newValue; }

    public int getSpeed() { return speed; }
    public void setSpeed(int newValue) { speed = newValue; }

    public int getGear() { return gear; }
    public void setGear(int newValue) { gear = newValue; }

    @Override
    public void printDescription() {
        System.out.println("Bike is " + "in gear " + this.gear 
                + " with a cadence of " + this.cadence 
                + " and travelling at a speed of " + this.speed + ". ");
    }
}

class MountainBike extends Bicycle {
    private String suspension;

    public MountainBike(int startCadence, int startSpeed, int startGear, String suspensionType) {
        super(startCadence, startSpeed, startGear);
        this.setSuspension(suspensionType);
    }

    public String getSuspension() { return this.suspension; }
    public void setSuspension(String suspensionType) { this.suspension = suspensionType; }

    @Override
    public void printDescription() {
        super.printDescription();
        System.out.println("The MountainBike has a " + getSuspension() + " suspension.");
    }
}

class RoadBike extends Bicycle {
    private int tireWidth;

    public RoadBike(int startCadence, int startSpeed, int startGear, int newTireWidth) {
        super(startCadence, startSpeed, startGear);
        this.setTireWidth(newTireWidth);
    }

    public int getTireWidth() { return this.tireWidth; }
    public void setTireWidth(int newTireWidth) { this.tireWidth = newTireWidth; }

    @Override
    public void printDescription() {
        super.printDescription();
        System.out.println("The RoadBike has " + getTireWidth() + " MM tires.");
    }
}
