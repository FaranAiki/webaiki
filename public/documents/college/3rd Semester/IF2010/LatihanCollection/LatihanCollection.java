import java.util.Arrays;
import java.util.stream.Collectors;

public class LatihanCollection {
  public static void main(String args[]) {
    SomewhatPriorityQueue<Integer> spq = new SomewhatPriorityQueue<>();
    
    // woohoo kita pake stream
    // spq.addAll[for (String arg: args) int(arg)] 
    spq.addAll(Arrays.stream(args)
                      .map(Integer::valueOf)
                      .collect(Collectors.toList()));
  
    System.out.println("Setelah diurutkan, didapat: " + spq);
    System.out.println("Nilai maksimum: " + spq.getMaximum());
    System.out.println("Nilai minimum: " + spq.getMinimum());
  }
}
