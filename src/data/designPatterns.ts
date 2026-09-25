import type { DesignPattern, PatternCategoryMeta } from '../types/designPattern'

export const PATTERN_CATEGORIES: PatternCategoryMeta[] = [
  { key: 'creational', label: 'Créationnels' },
  { key: 'structural', label: 'Structurels' },
  { key: 'behavioral', label: 'Comportementaux' },
  { key: 'architecture', label: 'Architecture' },
]

export const DESIGN_PATTERNS: DesignPattern[] = [
  {
    id: 'singleton',
    category: 'creational',
    title: 'Singleton',
    definition:
      "Garantit qu'une classe n'a qu'une seule instance dans toute l'application et fournit un point d'accès global à celle-ci.",
    whenToUse:
      "Configuration partagée, pool de connexions, registre de cache, logger — tout état ou ressource qui doit exister en un seul exemplaire. En Spring, un bean en scope singleton (le défaut) remplit déjà ce rôle sans code manuel.",
    lang: 'java',
    code: `public enum AppConfig {
    INSTANCE;

    private final Map<String, String> settings = new ConcurrentHashMap<>();

    public String get(String key) {
        return settings.get(key);
    }
}

// Utilisation : AppConfig.INSTANCE.get("apiUrl");`,
    pitfall:
      "Un double-checked locking fait à la main sans le mot-clé volatile peut exposer à un autre thread une référence vers un objet partiellement construit. L'enum singleton évite ce piège nativement et reste thread-safe sans synchronisation explicite.",
  },
  {
    id: 'factory-method',
    category: 'creational',
    title: 'Factory Method',
    definition:
      "Délègue la création d'un objet à une méthode, souvent surchargée dans une sous-classe, plutôt que d'appeler directement new.",
    whenToUse:
      "Le type exact d'objet à créer dépend du contexte (ex. un handler différent selon le canal de vente : Airbnb, Booking.com, direct).",
    lang: 'java',
    code: `interface ChannelHandler { void sync(); }

class AirbnbHandler implements ChannelHandler {
    public void sync() { /* logique Airbnb */ }
}

abstract class ChannelHandlerFactory {
    abstract ChannelHandler createHandler();
}

class AirbnbHandlerFactory extends ChannelHandlerFactory {
    ChannelHandler createHandler() { return new AirbnbHandler(); }
}`,
    pitfall:
      "Créer une fabrique dédiée pour un seul type concret, sans variation réelle prévue : l'injection de dépendances directe (via Spring) suffirait largement.",
  },
  {
    id: 'abstract-factory',
    category: 'creational',
    title: 'Abstract Factory',
    definition:
      "Fournit une interface pour créer des familles entières d'objets liés entre eux, sans exposer leurs classes concrètes à l'appelant.",
    whenToUse:
      "Garantir que plusieurs composants créés ensemble restent cohérents entre eux : par exemple, un provider de paiement (Stripe, PayPal) qui doit fournir tout un ensemble de services associés (client, validateur de webhook).",
    lang: 'java',
    code: `interface PaymentProviderFactory {
    PaymentClient createClient();
    WebhookValidator createValidator();
}

class StripeFactory implements PaymentProviderFactory {
    public PaymentClient createClient() { return new StripeClient(); }
    public WebhookValidator createValidator() { return new StripeWebhookValidator(); }
}`,
    pitfall:
      "Introduire une Abstract Factory complexe alors qu'un simple Factory Method, voire une injection de dépendances directe, suffirait — sur-ingénierie fréquente.",
  },
  {
    id: 'builder',
    category: 'creational',
    title: 'Builder',
    definition:
      "Sépare la construction d'un objet complexe de sa représentation finale, en assemblant l'objet étape par étape via un chaînage fluide.",
    whenToUse:
      "Un objet a beaucoup de champs, dont plusieurs optionnels, ce qui rendrait un constructeur classique illisible ou sujet à erreur d'ordre des paramètres.",
    lang: 'java',
    code: `Reservation reservation = Reservation.builder()
    .propertyId(42L)
    .checkIn(LocalDate.of(2026, 7, 1))
    .checkOut(LocalDate.of(2026, 7, 8))
    .guestCount(4)
    .build();

// Généré automatiquement par @Builder (Lombok) sur la classe Reservation`,
    pitfall:
      "Utiliser un Builder pour un objet à deux ou trois champs simples et obligatoires, où un constructeur classique ferait parfaitement l'affaire.",
  },
  {
    id: 'adapter',
    category: 'structural',
    title: 'Adapter',
    definition:
      "Convertit l'interface d'une classe existante, souvent une bibliothèque tierce, en une autre interface attendue par le code appelant.",
    whenToUse:
      "Intégrer plusieurs API externes hétérogènes (channels de réservation, fournisseurs de paiement) derrière une interface interne unique et cohérente.",
    lang: 'java',
    code: `interface ChannelSyncAdapter {
    List<Booking> fetchBookings();
}

class AirbnbAdapter implements ChannelSyncAdapter {
    private final AirbnbApiClient client;

    public List<Booking> fetchBookings() {
        return client.getReservations().stream()
            .map(this::toInternalBooking)
            .toList();
    }
}`,
    pitfall:
      "Laisser fuir des types spécifiques au fournisseur externe (formats de date, enums propriétaires) au-delà de l'adaptateur, ce qui recouple le reste du code à cette API tierce.",
  },
  {
    id: 'facade',
    category: 'structural',
    title: 'Facade',
    definition:
      "Fournit une interface simplifiée et unifiée à un ensemble de classes ou de sous-systèmes complexes.",
    whenToUse:
      "Orchestrer plusieurs services indépendants (disponibilité, paiement, notification) derrière une seule méthode métier, pour simplifier l'usage côté contrôleur.",
    lang: 'java',
    code: `class CheckoutFacade {
    private final AvailabilityService availability;
    private final PaymentService payment;
    private final NotificationService notification;

    public Booking completeBooking(BookingRequest request) {
        availability.reserve(request);
        payment.charge(request.getAmount());
        notification.sendConfirmation(request);
        return new Booking(request);
    }
}`,
    pitfall:
      "Transformer la Facade en God Object qui accumule elle-même la logique métier, au lieu de se contenter d'orchestrer des services qui la portent.",
  },
  {
    id: 'decorator',
    category: 'structural',
    title: 'Decorator',
    definition:
      "Ajoute dynamiquement des comportements supplémentaires à un objet, en l'enveloppant dans un ou plusieurs décorateurs qui implémentent la même interface.",
    whenToUse:
      "Combiner des comportements optionnels (cache, logging, validation) sans faire exploser le nombre de sous-classes par combinaison possible.",
    lang: 'java',
    code: `interface PriceCalculator { BigDecimal calculate(Booking booking); }

class LoggingPriceCalculator implements PriceCalculator {
    private final PriceCalculator delegate;

    public BigDecimal calculate(Booking booking) {
        BigDecimal price = delegate.calculate(booking);
        log.info("Prix calculé : {}", price);
        return price;
    }
}`,
    pitfall:
      "Multiplier les niveaux de sous-classes pour chaque combinaison de comportements possible, plutôt que de composer des décorateurs interchangeables (ou de passer par l'AOP Spring).",
  },
  {
    id: 'proxy',
    category: 'structural',
    title: 'Proxy',
    definition:
      "Introduit un objet intermédiaire qui contrôle l'accès à un objet réel, en ajoutant un comportement avant ou après la délégation.",
    whenToUse:
      "Chargement paresseux (proxy Hibernate), sécurité, cache, transactions — le plus souvent via l'AOP Spring, sans avoir à écrire le proxy soi-même.",
    lang: 'java',
    code: `@Service
class ReservationService {
    @Transactional
    public void cancel(Long id) {
        // Spring génère un proxy qui ouvre puis valide/annule
        // la transaction autour de cet appel
    }
}`,
    pitfall:
      "Appeler cette méthode depuis une autre méthode de la MÊME classe (auto-invocation) contourne le proxy Spring : la transaction ne s'applique alors pas.",
  },
  {
    id: 'strategy',
    category: 'behavioral',
    title: 'Strategy',
    definition:
      "Définit une famille d'algorithmes interchangeables, chacun encapsulé dans sa propre classe implémentant une interface commune, sélectionnable à l'exécution.",
    whenToUse:
      "Remplacer une longue chaîne de if/else ou un switch sur un type par des règles métier interchangeables — typiquement le calcul de prix selon différentes règles tarifaires.",
    lang: 'java',
    code: `interface PricingStrategy { BigDecimal price(Booking booking); }

class StandardPricing implements PricingStrategy { /* ... */ }
class LastMinutePricing implements PricingStrategy { /* ... */ }

class PriceEngine {
    private final PricingStrategy strategy;

    public BigDecimal calculate(Booking booking) {
        return strategy.price(booking);
    }
}`,
    pitfall:
      "Introduire Strategy dès les deux ou trois premiers cas simples et stables : c'est de la sur-ingénierie tant que le nombre de cas et leur volatilité ne le justifient pas (Rule of Three).",
  },
  {
    id: 'observer',
    category: 'behavioral',
    title: 'Observer',
    definition:
      "Un sujet maintient une liste d'observateurs et les notifie automatiquement de tout changement d'état pertinent, sans les connaître en détail.",
    whenToUse:
      "Découpler un événement métier (réservation créée) de ses traitements secondaires (email de confirmation, mise à jour de statistiques).",
    lang: 'java',
    code: `// Publication
applicationEventPublisher.publishEvent(new ReservationCreatedEvent(reservation));

// Souscription, dans un autre composant
@EventListener
void onReservationCreated(ReservationCreatedEvent event) {
    emailService.sendConfirmation(event.getReservation());
}`,
    pitfall:
      "Un listener synchrone (@EventListener par défaut) qui échoue fait échouer toute la transaction d'origine, sauf usage explicite de @Async ou @TransactionalEventListener.",
  },
  {
    id: 'template-method',
    category: 'behavioral',
    title: 'Template Method',
    definition:
      "Définit le squelette fixe d'un algorithme dans une classe de base, en déléguant certaines étapes variables à des sous-classes qui les surchargent.",
    whenToUse:
      "Un flux commun à plusieurs fournisseurs (ex. authentification OAuth) où seules certaines étapes changent selon le fournisseur (Airbnb, Minut).",
    lang: 'java',
    code: `abstract class OAuthService {
    public final AccessToken authenticate(String code) {
        String token = exchangeCodeForToken(code);
        UserInfo info = fetchUserInfo(token);
        return buildAccessToken(info);
    }

    protected abstract String exchangeCodeForToken(String code);
    protected abstract UserInfo fetchUserInfo(String token);
}`,
    pitfall:
      "Confondre avec Strategy : ici l'algorithme global reste fixe et hérité, il n'est pas remplaçable entièrement à l'exécution comme le serait une stratégie.",
  },
  {
    id: 'chain-of-responsibility',
    category: 'behavioral',
    title: 'Chain of Responsibility',
    definition:
      "Fait passer une requête à travers une chaîne de handlers successifs, chacun décidant de la traiter ou de la transmettre au suivant.",
    whenToUse:
      "Pipeline de validation (disponibilité, règles tarifaires, fraude) ou chaîne de middlewares HTTP (authentification, logging, CORS).",
    lang: 'java',
    code: `interface ValidationHandler {
    void setNext(ValidationHandler next);
    void handle(BookingRequest request);
}

class AvailabilityCheck implements ValidationHandler {
    private ValidationHandler next;

    public void setNext(ValidationHandler next) { this.next = next; }

    public void handle(BookingRequest request) {
        if (!isAvailable(request)) throw new UnavailableException();
        if (next != null) next.handle(request);
    }
}`,
    pitfall:
      "Construire une chaîne si longue et implicite qu'il devient difficile de savoir dans quel ordre les handlers s'exécutent, ou lequel a bloqué une requête, sans journalisation explicite.",
  },
  {
    id: 'command',
    category: 'behavioral',
    title: 'Command',
    definition:
      "Encapsule une requête, c'est-à-dire une action à exécuter avec ses paramètres, sous forme d'un objet à part entière.",
    whenToUse:
      "File de tâches asynchrones (envoi d'email, génération de rapport) ou fonctionnalité d'annulation (undo) d'une action déjà exécutée.",
    lang: 'java',
    code: `record SendEmailCommand(String to, String template) {
    void execute(EmailService service) {
        service.send(to, template);
    }
}

// Producteur : queue.put(new SendEmailCommand(to, template));
// Worker     : queue.take().execute(emailService);`,
    pitfall:
      "Confondre Command (une intention d'action, généralement un seul destinataire) avec un événement Observer (une notification qu'un fait s'est déjà produit, potentiellement à plusieurs abonnés).",
  },
  {
    id: 'state',
    category: 'behavioral',
    title: 'State',
    definition:
      "Permet à un objet de changer de comportement lorsque son état interne change, en encapsulant chaque état dans sa propre classe.",
    whenToUse:
      "Cycle de vie d'une réservation ou d'une commande (PENDING, CONFIRMED, CANCELLED) où les actions permises diffèrent selon l'état courant.",
    lang: 'java',
    code: `interface BookingState {
    BookingState confirm();
    BookingState cancel();
}

class PendingState implements BookingState {
    public BookingState confirm() { return new ConfirmedState(); }
    public BookingState cancel() { return new CancelledState(); }
}`,
    pitfall:
      "Utiliser ce pattern pour une machine à états très simple avec seulement deux ou trois transitions triviales, où un simple enum avec quelques méthodes suffirait.",
  },
  {
    id: 'repository',
    category: 'architecture',
    title: 'Repository',
    definition:
      "Fournit une interface orientée collection pour accéder aux entités du domaine, masquant les détails techniques d'accès aux données.",
    whenToUse:
      "Découpler la logique métier de la technologie de persistance sous-jacente, et faciliter le mock en test unitaire.",
    lang: 'java',
    code: `interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByPropertyIdAndStatus(Long propertyId, Status status);
}`,
    pitfall:
      "Laisser fuir des détails de persistance (objets de requête JPA, exceptions Hibernate) à travers l'interface du repository, recouplant le métier à l'implémentation technique.",
  },
  {
    id: 'dto',
    category: 'architecture',
    title: 'DTO (Data Transfer Object)',
    definition:
      "Objet simple, sans logique métier, dont le seul rôle est de transporter des données entre couches ou à travers un réseau.",
    whenToUse:
      "Exposer une API REST sans coupler son contrat public au modèle de persistance, qui peut alors évoluer indépendamment.",
    lang: 'java',
    code: `record ReservationDto(Long id, String propertyName, LocalDate checkIn, LocalDate checkOut) {
    static ReservationDto from(Reservation entity) {
        return new ReservationDto(
            entity.getId(),
            entity.getProperty().getName(),
            entity.getCheckIn(),
            entity.getCheckOut()
        );
    }
}`,
    pitfall:
      "Retourner directement une entité JPA depuis un contrôleur REST : risque de fuite de champs internes et de LazyInitializationException hors du contexte de persistance.",
  },
  {
    id: 'mvc',
    category: 'architecture',
    title: 'MVC (Model-View-Controller)',
    definition:
      "Sépare une application en trois responsabilités : le Model (données et logique métier), la View (présentation) et le Controller (orchestration).",
    whenToUse:
      "Structurer toute application avec une interface utilisateur, pour que chaque couche évolue et se teste indépendamment.",
    lang: 'java',
    code: `@RestController
class ReservationController {
    private final ReservationService service; // porte la logique métier (Model)

    @PostMapping("/reservations")
    ReservationDto create(@RequestBody CreateReservationRequest request) {
        Reservation reservation = service.create(request);
        return ReservationDto.from(reservation); // prépare la vue (JSON)
    }
}`,
    pitfall:
      "Faire porter de la logique métier au Controller (calculs, règles de validation complexes) au lieu de la déléguer au service, ce qui le rend difficile à tester isolément.",
  },
  {
    id: 'cqrs',
    category: 'architecture',
    title: 'CQRS',
    definition:
      "Sépare les opérations qui modifient l'état (commands) des opérations qui le lisent (queries), via des modèles potentiellement différents.",
    whenToUse:
      "Charges de lecture et d'écriture très asymétriques, où la lecture bénéficie d'un modèle dénormalisé optimisé pour l'affichage.",
    lang: 'java',
    code: `// Command : valide et écrit
class CreateReservationCommandHandler {
    Reservation handle(CreateReservationCommand cmd) {
        // validation métier + persistance
    }
}

// Query : lit un modèle dénormalisé, optimisé pour l'affichage
class ReservationSummaryQueryHandler {
    ReservationSummaryView handle(GetReservationSummaryQuery query) {
        // lecture rapide, sans logique métier
    }
}`,
    pitfall:
      "Adopter CQRS avec deux bases de données séparées pour une application CRUD classique, sans besoin réel d'asymétrie lecture/écriture — complexité de synchronisation injustifiée.",
  },
  {
    id: 'circuit-breaker',
    category: 'architecture',
    title: 'Circuit Breaker',
    definition:
      "Surveille les appels vers un service externe et arrête temporairement d'en émettre après un seuil d'échecs, pour éviter de le surcharger davantage.",
    whenToUse:
      "Résilience face à une API tierce instable (channel de réservation, provider de paiement) qui peut tomber en panne ou ralentir.",
    lang: 'java',
    code: `@CircuitBreaker(name = "airbnbApi", fallbackMethod = "fallbackSync")
public SyncResult syncWithAirbnb(Property property) {
    return airbnbClient.sync(property);
}

private SyncResult fallbackSync(Property property, Throwable t) {
    return SyncResult.degraded();
}`,
    pitfall:
      "Configurer un Circuit Breaker sans fallback ni stratégie de dégradation : cela remplace juste une erreur de timeout par une erreur immédiate, sans bénéfice réel pour l'utilisateur.",
  },
  {
    id: 'saga',
    category: 'architecture',
    title: 'Saga',
    definition:
      "Décompose une transaction métier longue, qui traverse plusieurs services, en une séquence d'étapes locales compensables en cas d'échec.",
    whenToUse:
      "Transaction distribuée à travers plusieurs microservices, où un verrou distribué global (2PC) dégraderait trop la disponibilité.",
    lang: 'java',
    code: `// Étape 1 (service Booking)  : réservation créée → publie ReservationCreated
// Étape 2 (service Payment)  : paiement débité   → publie PaymentCharged
// En cas d'échec du paiement : publie PaymentFailed

@EventListener
void onPaymentFailed(PaymentFailedEvent event) {
    bookingService.cancel(event.getReservationId()); // transaction compensatoire
}`,
    pitfall:
      "Croire qu'une saga garantit la même atomicité qu'une transaction ACID : il existe une fenêtre de temps où l'état intermédiaire est visible avant une éventuelle compensation.",
  },
]
